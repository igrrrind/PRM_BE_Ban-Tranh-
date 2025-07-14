const vnpay = require("../config/vnpay.config");
const { Cart, CartItem, Product, Order, OrderItem, Payment } = require("../models");
const order = require("../models/order");
const payment = require("../models/payment");
exports.createPayment = (req, res) => {
  try {
    const { amount, orderInfo } = req.body;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo || "Thanh toán đơn hàng demo",
    });

    return res.json({ success: true, paymentUrl });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.handleReturn = async (req, res) => {
  console.log("🌿 [handleReturn] VNPay return received.");
  console.log("🔹 Query Params:", JSON.stringify(req.query, null, 2));

  const verify = vnpay.verifyReturnUrl(req.query);
  console.log("🔹 verifyReturnUrl:", verify);

  const txnRef = req.query.vnp_TxnRef; // dạng: cartId_userId_timestamp
  console.log("🔹 txnRef:", txnRef);

  const redirectBase = process.env.VNP_FRONTEND_RETURN || "";
  const isDeepLink = redirectBase.startsWith("cuahangtranh://");
  console.log("🔹 redirectBase:", redirectBase);
  console.log("🔹 isDeepLink:", isDeepLink);

  let order = null; // moved here to avoid undefined reference
  let payment = null

  // ✅ Nếu thanh toán thành công → tạo đơn hàng
  if (verify.isSuccess) {
    try {
      const [cartId, userId] = txnRef.split("_");
      console.log("🔹 cartId:", cartId);
      console.log("🔹 userId:", userId);

      const cart = await Cart.findOne({
        where: { id: cartId, userID: userId },
        include: ["CartItems"],
      });
      console.log("🔹 Cart found:", !!cart);
      if (cart) {
        console.log("🔹 Cart Items count:", cart.CartItems.length);
      }

      if (cart && cart.CartItems.length > 0) {
        order = await Order.create({
          userID: userId,
          billingAddress: cart.billingAddress || "Địa chỉ chưa cập nhật",
          orderStatus: "shipped", // thanh toán xong là giao hàng luôn
          paymentMethod: "VNPay",
          orderDate: new Date(),
          total: cart.totalPrice,
        });
        console.log("✅ Order created:", order.id);

        payment = await Payment.create({
          orderID: order.id,
          amount: cart.totalPrice,
          paymentDate: new Date(),
          paymentStatus: "paid", // or "completed" based on your enums
        });

        for (const item of cart.CartItems) {
          let price = item.price;
          if (price == null) {
            const product = await Product.findByPk(item.productID);
            price = product ? product.price : 0;
            if (!product) {
              console.warn(`⚠️ Product with ID ${item.productID} not found, using price 0.`);
            }
          }
          await OrderItem.create({
            orderID: order.id,
            productID: item.productID,
            quantity: item.quantity,
            price,
          });
          console.log(`✅ OrderItem created for product ${item.productID} with price ${price}`);
        }

        await CartItem.destroy({ where: { cartID: cartId } });
        console.log(`✅ CartItems for cartID ${cartId} deleted.`);
      } else {
        console.warn(`⚠️ Cart not found or empty for cartId: ${cartId}, userId: ${userId}`);
      }
    } catch (error) {
      console.error("❌ Error creating order after payment:", error);
    }
  } else {
    console.warn("⚠️ Payment verification failed, skipping order creation.");
  }

  // 🔁 Redirect logic
  const redirectUrl = new URL(redirectBase);
  if (verify.isSuccess && order) {
    redirectUrl.searchParams.set("status", "success");
    redirectUrl.searchParams.set("orderId", order.id);
  } else {
    redirectUrl.searchParams.set("status", "fail");
    redirectUrl.searchParams.set(
      "message",
      verify.message || "Thanh toán thất bại"
    );
  }

  console.log("🔹 Redirecting to:", redirectUrl.toString());

  if (isDeepLink) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Đang chuyển hướng</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl.toString()}" />
          <script>
            setTimeout(() => {
              window.location.replace("${redirectUrl.toString()}");
            }, 500);
          </script>
        </head>
        <body>
          <h2>🔄 Đang chuyển hướng...</h2>
        </body>
      </html>
    `);
  }

  return res.redirect(redirectUrl.toString());
};

