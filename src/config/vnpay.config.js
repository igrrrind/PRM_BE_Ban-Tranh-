require('dotenv').config();
const { VNPay } = require('vnpay');

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASHSECRET,
  vnpayHost: process.env.VNP_URL,
  testMode: true,
  hashAlgorithm: 'SHA512',
});

module.exports = vnpay;
