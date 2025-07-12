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

  if (verify.isSuccess) {
    return res.send(`✅ Thanh toán thành công! Mã đơn: ${req.query.vnp_TxnRef}`);
  } else {
    return res.send(`❌ Thanh toán thất bại: ${verify.message}`);
  }
};
