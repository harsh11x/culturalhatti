const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay;

if (keyId && keySecret) {
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
} else {
    razorpay = {
        orders: { create: async () => ({ id: 'order_mock_' + Date.now(), amount: 0, currency: 'INR' }) },
        payments: { refund: async () => ({ id: 'refund_mock_' + Date.now() }) },
    };
}

module.exports = razorpay;
