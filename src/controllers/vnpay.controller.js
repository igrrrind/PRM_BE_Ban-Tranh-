const vnpay = require('../config/vnpay.config');
const { Order } = require('../models');
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
  const id = req.query.vnp_TxnRef;

  const redirectBase = process.env.VNP_FRONTEND_RETURN || '';
  const isDeepLink = redirectBase.startsWith('cuahangtranh://');

  // ✅ Nếu thanh toán thành công thì cập nhật đơn hàng
  if (verify.isSuccess) {
    try {
      const order = await Order.findOne({ where: { id } });
      if (order) {
        order.orderStatus = 'shipped'; // hoặc 'paid'
        await order.save();
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật đơn hàng:', error);
    }
  }

  // Tạo URL redirect về app hoặc web
  const redirectUrl = new URL(redirectBase);
  if (verify.isSuccess) {
    redirectUrl.searchParams.set('status', 'success');
    redirectUrl.searchParams.set('orderId', id);
  } else {
    redirectUrl.searchParams.set('status', 'fail');
    redirectUrl.searchParams.set('message', verify.message || 'Thanh toán thất bại');
  }

  // Gửi HTML mở deep link hoặc redirect về web
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
  
