const vnpay = require('../config/vnpay.config');
const { Cart, CartItem, Product, Order, OrderItem } = require('../models');
exports.createPayment = (req, res) => {
  try {
    const { amount, orderInfo } = req.body;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo || 'Thanh toán đơn hàng demo',
    });

    return res.json({ success: true, paymentUrl });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.handleReturn = async (req, res) => {
  const verify = vnpay.verifyReturnUrl(req.query);
  const txnRef = req.query.vnp_TxnRef; // dạng: cartId_userId_timestamp

  const redirectBase = process.env.VNP_FRONTEND_RETURN || '';
  const isDeepLink = redirectBase.startsWith('cuahangtranh://');

  // ✅ Nếu thanh toán thành công → tạo đơn hàng
  if (verify.isSuccess) {
    try {
      const [cartId, userId] = txnRef.split('_');

      // Lấy cart và item
      const cart = await Cart.findOne({
        where: { id: cartId, userID: userId },
        include: ['CartItems'],
      });

      if (cart && cart.CartItems.length > 0) {
        // Tạo đơn hàng
        const order = await Order.create({
          userID: userId,
          billingAddress: cart.billingAddress || 'Địa chỉ chưa cập nhật',
          orderStatus: 'shipped', // thanh toán xong là giao hàng luôn
          paymentMethod: 'VNPay',
          orderDate: new Date(),
        });

        for (const item of cart.CartItems) {
          let price = item.price;
          if (price == null) {
            const product = await Product.findByPk(item.productID);
            price = product ? product.price : 0;
          }
          await OrderItem.create({
            orderID: order.id,
            productID: item.productID,
            quantity: item.quantity,
            price,
          });
        }

        // Xoá cart sau khi tạo order
        await CartItem.destroy({ where: { cartID: cartId } });
      }
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng sau thanh toán:', error);
    }
  }

  // 🔁 Redirect logic như cũ
  const redirectUrl = new URL(redirectBase);
  if (verify.isSuccess) {
    redirectUrl.searchParams.set('status', 'success');
    redirectUrl.searchParams.set('orderId', req.query.vnp_TxnRef); // bạn có thể đổi thành order.id nếu muốn
  } else {
    redirectUrl.searchParams.set('status', 'fail');
    redirectUrl.searchParams.set('message', verify.message || 'Thanh toán thất bại');
  }

  if (isDeepLink) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Đang chuyển hướng</title></head>
        <body>
          <script>
            setTimeout(() => {
              window.location.href = "${redirectUrl.toString()}";
            }, 500);
            setTimeout(() => {
              document.body.innerHTML += "<p style='color:red;'>Không mở được ứng dụng.</p>";
            }, 3000);
          </script>
          <h2>🔄 Đang chuyển hướng...</h2>
        </body>
      </html>
    `);
  }

  return res.redirect(redirectUrl.toString());
};

  
