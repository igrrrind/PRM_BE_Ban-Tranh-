const vnpay = require('../config/vnpay.config');

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

exports.handleReturn = (req, res) => {
    const verify = vnpay.verifyReturnUrl(req.query);
  
    const redirectBase = process.env.VNP_FRONTEND_RETURN || '';
    const isDeepLink = redirectBase.startsWith('myapp://');
  
    if (isDeepLink) {
      // ❌ Trình duyệt không mở được deep link → dùng send() để test
      return res.send(`
        <h2>🔄 Kết quả thanh toán</h2>
        <p><strong>Trạng thái:</strong> ${verify.isSuccess ? '✅ Thành công' : '❌ Thất bại'}</p>
        <p><strong>Mã đơn hàng:</strong> ${req.query.vnp_TxnRef}</p>
        <p><strong>Chi tiết:</strong> ${verify.message || 'Không rõ'}</p>
      `);
    }
  
    // ✅ Có thể redirect đến web app hoặc domain
    const redirectUrl = new URL(redirectBase);
    if (verify.isSuccess) {
      redirectUrl.searchParams.set('status', 'success');
      redirectUrl.searchParams.set('orderId', req.query.vnp_TxnRef);
    } else {
      redirectUrl.searchParams.set('status', 'fail');
      redirectUrl.searchParams.set('message', verify.message || 'Thanh toán thất bại');
    }
  
    return res.redirect(redirectUrl.toString());
  };
  
