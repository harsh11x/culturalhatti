const Razorpay = require('razorpay');

// MOCK Razorpay for local testing without keys
const razorpay = {
    orders: { create: async () => ({ id: 'order_mock_' + Date.now() }) },
    payments: { refund: async () => ({ id: 'refund_mock_' + Date.now() }) }
};

module.exports = razorpay;
