const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { Order, Payment, Product, OrderItem, sequelize } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/**
 * Create a Razorpay order and persist the order record
 */
const createRazorpayOrder = async ({ orderId, amountInPaise, currency = 'INR', receipt }) => {
    const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receipt || orderId,
        payment_capture: 1,
    });

    await Order.update(
        { razorpay_order_id: rzpOrder.id },
        { where: { id: orderId } }
    );

    const payment = await Payment.create({
        order_id: orderId,
        razorpay_order_id: rzpOrder.id,
        amount: amountInPaise / 100,
        currency,
        status: 'created',
    });

    return { rzpOrder, payment };
};

/**
 * Verify payment signature (called after frontend payment success)
 */
const verifySignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    return expected === razorpay_signature;
};

/**
 * Confirm payment and transition order to 'confirmed'
 * Deducts stock atomically
 */
const confirmPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
        throw Object.assign(new Error('Invalid payment signature'), { status: 400 });
    }

    const order = await Order.findOne({
        where: { razorpay_order_id },
        include: [
            { association: 'items' },
            { association: 'user' },
        ],
    });

    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    if (order.status !== 'pending_payment') {
        throw Object.assign(new Error('Order already processed'), { status: 400 });
    }

    const t = await sequelize.transaction();
    try {
        // Deduct stock for each item
        for (const item of order.items) {
            const [updated] = await Product.update(
                { stock: sequelize.literal(`stock - ${item.quantity}`) },
                {
                    where: {
                        id: item.product_id,
                        stock: { [require('sequelize').Op.gte]: item.quantity },
                    },
                    transaction: t,
                }
            );
            if (!updated) {
                throw new Error(`Insufficient stock for product ${item.product_name}`);
            }
        }

        await Payment.update(
            {
                razorpay_payment_id,
                razorpay_signature,
                status: 'paid',
                verified_at: new Date(),
            },
            { where: { razorpay_order_id }, transaction: t }
        );

        await Order.update(
            {
                status: 'confirmed',
                payment_id: razorpay_payment_id,
            },
            { where: { id: order.id }, transaction: t }
        );

        await t.commit();

        // Send confirmation email
        await emailService.sendOrderConfirmation(order).catch((e) =>
            logger.error('Email failed after confirmation', { error: e.message })
        );
        await emailService.sendAdminNewOrder(order).catch((e) =>
            logger.error('Admin email failed', { error: e.message })
        );

        return order;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

/**
 * Confirm payment from webhook (no frontend signature - webhook already verified)
 * Deducts stock, updates order, sends customer + admin emails
 */
const confirmPaymentFromWebhook = async ({ razorpay_order_id, razorpay_payment_id }) => {
    const order = await Order.findOne({
        where: { razorpay_order_id },
        include: [
            { association: 'items' },
            { association: 'user' },
        ],
    });
    if (!order || order.status !== 'pending_payment') return null;

    const t = await sequelize.transaction();
    try {
        for (const item of order.items) {
            const [updated] = await Product.update(
                { stock: sequelize.literal(`stock - ${item.quantity}`) },
                {
                    where: {
                        id: item.product_id,
                        stock: { [require('sequelize').Op.gte]: item.quantity },
                    },
                    transaction: t,
                }
            );
            if (!updated) throw new Error(`Insufficient stock for product ${item.product_name}`);
        }
        await Payment.update(
            { razorpay_payment_id, status: 'paid', verified_at: new Date() },
            { where: { razorpay_order_id }, transaction: t }
        );
        await Order.update(
            { status: 'confirmed', payment_id: razorpay_payment_id },
            { where: { id: order.id }, transaction: t }
        );
        await t.commit();

        const updatedOrder = await Order.findByPk(order.id, {
            include: [{ association: 'items' }, { association: 'user' }],
        });
        await emailService.sendOrderConfirmation(updatedOrder).catch((e) =>
            logger.error('Webhook: email failed', { error: e.message })
        );
        await emailService.sendAdminNewOrder(updatedOrder).catch((e) =>
            logger.error('Webhook: admin email failed', { error: e.message })
        );
        return updatedOrder;
    } catch (err) {
        await t.rollback();
        logger.error('Webhook confirmPayment failed', { error: err.message });
        throw err;
    }
};

/**
 * Verify webhook from Razorpay
 */
const verifyWebhookSignature = (rawBody, signature) => {
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');
    return expected === signature;
};

/**
 * Trigger refund via Razorpay API
 */
const initiateRefund = async (orderId, amount) => {
    const order = await Order.findByPk(orderId, {
        include: [{ association: 'payments' }, { association: 'user' }],
    });
    if (!order || !order.payment_id) {
        throw Object.assign(new Error('No payment to refund'), { status: 400 });
    }

    const refundAmountPaise = amount
        ? Math.round(parseFloat(amount) * 100)
        : Math.round(parseFloat(order.total_amount) * 100);

    const refund = await razorpay.payments.refund(order.payment_id, {
        amount: refundAmountPaise,
    });

    await Payment.update(
        {
            refund_id: refund.id,
            refund_amount: refundAmountPaise / 100,
            refunded_at: new Date(),
            status: 'refunded',
        },
        { where: { order_id: orderId } }
    );

    await Order.update(
        { status: 'refunded', refund_id: refund.id },
        { where: { id: orderId } }
    );

    const orderData = { ...order.toJSON(), user: order.user, refund_id: refund.id };
    await emailService.sendOrderRefunded(orderData).catch((e) =>
        logger.error('Refund email failed', { error: e.message })
    );
    await emailService.sendAdminOrderRefunded(orderData).catch((e) =>
        logger.error('Admin refund email failed', { error: e.message })
    );

    return refund;
};

module.exports = {
    createRazorpayOrder,
    verifySignature,
    confirmPayment,
    confirmPaymentFromWebhook,
    verifyWebhookSignature,
    initiateRefund,
};
