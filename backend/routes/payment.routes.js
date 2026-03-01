const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const { Order, Payment } = require('../models');
const logger = require('../utils/logger');

// POST /api/payments/verify - Called by frontend after Razorpay success
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment fields' });
    }
    const order = await paymentService.confirmPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    res.json({ success: true, order_id: order.id, order_number: order.order_number, status: order.status });
});

// POST /api/payments/webhook - Razorpay webhook (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['x-razorpay-signature'];
    const rawBody = req.body.toString('utf8');

    if (!paymentService.verifyWebhookSignature(rawBody, sig)) {
        logger.warn('Webhook signature verification failed');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    let event;
    try { event = JSON.parse(rawBody); } catch { return res.status(400).json({ success: false, message: 'Invalid JSON' }); }

    const entity = event?.payload?.payment?.entity;
    if (!entity) return res.status(200).send('OK');

    logger.info(`Webhook event: ${event.event}`, { razorpay_payment_id: entity.id });

    if (event.event === 'payment.captured') {
        const { order_id: razorpay_order_id, id: razorpay_payment_id } = entity;
        const order = await Order.findOne({ where: { razorpay_order_id } });
        if (order && order.status === 'pending_payment') {
            // Verify if not already confirmed via signature
            await Payment.update({ status: 'paid', verified_at: new Date(), razorpay_payment_id }, { where: { razorpay_order_id } });
            await order.update({ status: 'confirmed', payment_id: razorpay_payment_id });
            logger.info(`Order confirmed via webhook: ${order.order_number}`);
        }
    }

    if (event.event === 'payment.failed') {
        const { order_id: razorpay_order_id } = entity;
        const order = await Order.findOne({ where: { razorpay_order_id } });
        if (order && order.status === 'pending_payment') {
            await Payment.update({ status: 'failed' }, { where: { razorpay_order_id } });
            logger.info(`Payment failed for order: ${order?.order_number}`);
        }
    }

    res.status(200).send('OK');
});

module.exports = router;
