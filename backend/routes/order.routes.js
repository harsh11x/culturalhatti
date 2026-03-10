const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const authenticate = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { Order, OrderItem, Product, User, Shipment, Payment } = require('../models');
const paymentService = require('../services/payment.service');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

const generateOrderNumber = () => `CH${Date.now().toString().slice(-8)}`;

// POST /api/orders - Create order (user authenticated)
router.post('/', authenticate, async (req, res) => {
    const { items, shipping_address, coupon_code } = req.body;
    if (!items || !items.length) return res.status(400).json({ success: false, message: 'No items in order' });
    if (!shipping_address) return res.status(400).json({ success: false, message: 'Shipping address required' });

    // Validate products and prices
    let total = 0;
    const orderItems = [];
    for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product || !product.is_active) return res.status(400).json({ success: false, message: `Product not found: ${item.product_id}` });
        if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        const lineTotal = parseFloat(product.price) * item.quantity;
        total += lineTotal;
        orderItems.push({ product_id: product.id, product_name: product.name, product_image: product.images?.[0] || null, quantity: item.quantity, price_at_purchase: product.price });
    }

    const order = await Order.create({
        order_number: generateOrderNumber(),
        user_id: req.user.id,
        status: 'pending_payment',
        total_amount: total.toFixed(2),
        shipping_address,
        coupon_code: coupon_code || null,
    });
    await OrderItem.bulkCreate(orderItems.map((oi) => ({ ...oi, order_id: order.id })));

    // Create Razorpay order
    const { rzpOrder } = await paymentService.createRazorpayOrder({
        orderId: order.id,
        amountInPaise: Math.round(total * 100),
        receipt: order.order_number,
    });

    res.status(201).json({
        success: true,
        order: { ...order.toJSON(), razorpay_order_id: rzpOrder.id },
        razorpay: {
            key_id: process.env.RAZORPAY_KEY_ID,
            order_id: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
        },
    });
});

// GET /api/orders - User's orders
router.get('/', authenticate, async (req, res) => {
    const orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [{ association: 'items' }, { association: 'shipment' }],
        order: [['created_at', 'DESC']],
    });
    res.json({ success: true, orders });
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
    const order = await Order.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [{ association: 'items' }, { association: 'shipment' }, { association: 'payments' }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
});

// POST /api/orders/:id/cancel - User cancel (only before processing)
router.post('/:id/cancel', authenticate, async (req, res) => {
    const order = await Order.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [{ model: User, as: 'user' }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const allowedStatuses = ['pending_payment', 'confirmed'];
    if (!allowedStatuses.includes(order.status)) {
        return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    await order.update({ status: 'cancelled', cancelled_reason: req.body.reason || 'Cancelled by customer' });
    const orderData = { ...order.toJSON(), user: order.user };
    await emailService.sendOrderCancelled(orderData).catch((e) => logger.error('Cancel email failed', { error: e.message }));
    await emailService.sendAdminOrderCancelled(orderData).catch((e) => logger.error('Admin cancel email failed', { error: e.message }));
    res.json({ success: true, message: 'Order cancelled' });
});

// ─── ADMIN ORDER ROUTES ─────────────────────────────

// GET /api/orders/admin/all
router.get('/admin/all', adminAuth, async (req, res) => {
    const { status, search, page = 1, limit = 20, since } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where[Op.or] = [
        { order_number: { [Op.iLike]: `%${search}%` } },
        { payment_id: { [Op.iLike]: `%${search}%` } },
    ];
    if (since === '24h') {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        where.created_at = { [Op.gte]: dayAgo };
    }
    const orders = await Order.findAndCountAll({
        where,
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
            { association: 'items' },
            { association: 'shipment' },
        ],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...orders, page: parseInt(page) });
});

// GET /api/orders/admin/export - Export all orders as Excel (admin only, cancelled rows in red)
router.get('/admin/export', adminAuth, async (req, res) => {
    const where = {};
    const { status, since } = req.query;
    if (status) where.status = status;
    if (since === '24h') {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        where.created_at = { [Op.gte]: dayAgo };
    }

    const orders = await Order.findAll({
        where,
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
            { association: 'items' },
            { association: 'shipment' },
        ],
        order: [['created_at', 'DESC']],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders', { headerFooter: { firstHeader: 'Orders Export' } });

    const header = [
        'Order #', 'Status', 'Order Date', 'Customer Name', 'Customer Email', 'Customer Phone',
        'Shipping Name', 'Shipping Phone', 'Address Line1', 'Address Line2', 'City', 'State', 'Pincode',
        'Item Name', 'Qty', 'Item Price', 'Item Total', 'Order Total',
    ];
    sheet.addRow(header);
    sheet.getRow(1).font = { bold: true };

    const redFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
    const monthlyTotals = {};

    let rowNum = 2;
    for (const order of orders) {
        const addr = order.shipping_address || {};
        const orderDate = order.created_at ? new Date(order.created_at) : null;
        const monthKey = orderDate
            ? `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`
            : null;

        if (order.status === 'delivered' && monthKey) {
            const amt = parseFloat(order.total_amount || 0) || 0;
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amt;
        }

        const isCancelledOrRefunded = order.status === 'cancelled' || order.status === 'refunded';
        const items = order.items && order.items.length ? order.items : [null];

        for (const item of items) {
            const itemTotal = item
                ? (parseFloat(item.price_at_purchase || 0) * item.quantity).toFixed(2)
                : '';
            const row = sheet.addRow([
                order.order_number,
                order.status,
                orderDate ? orderDate.toISOString() : '',
                order.user?.name || '',
                order.user?.email || '',
                order.user?.phone || '',
                addr.name || '',
                addr.phone || '',
                addr.line1 || '',
                addr.line2 || '',
                addr.city || '',
                addr.state || '',
                addr.pincode || '',
                item ? item.product_name : '',
                item ? item.quantity : '',
                item ? item.price_at_purchase : '',
                itemTotal,
                order.total_amount,
            ]);
            if (isCancelledOrRefunded) {
                row.eachCell((cell) => { cell.fill = redFill; });
            }
            rowNum++;
        }
    }

    // Monthly summary sheet
    const summarySheet = workbook.addWorksheet('Monthly Sales (Delivered)', { headerFooter: { firstHeader: 'Monthly Delivered Sales' } });
    summarySheet.addRow(['Month', 'Total Sales']);
    summarySheet.getRow(1).font = { bold: true };
    Object.keys(monthlyTotals)
        .sort()
        .forEach((month) => summarySheet.addRow([month, parseFloat(monthlyTotals[month].toFixed(2))]));

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `orders-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
});

// GET /api/orders/admin/:id
router.get('/admin/:id', adminAuth, async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
            { association: 'items' },
            { association: 'shipment' },
            { association: 'payments' },
        ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
});

// PUT /api/orders/admin/:id/status - Admin status update
router.put('/admin/:id/status', adminAuth, async (req, res) => {
    const { status, cancelled_reason } = req.body;
    const validTransitions = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validTransitions.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findByPk(req.params.id, {
        include: [{ model: User, as: 'user' }, { association: 'items' }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const updates = { status };
    if (status === 'cancelled') updates.cancelled_reason = cancelled_reason || 'Cancelled by admin';

    await order.update(updates);

    if (status === 'cancelled') {
        const orderData = { ...order.toJSON(), user: order.user };
        await emailService.sendOrderCancelled(orderData).catch(() => { });
        await emailService.sendAdminOrderCancelled(orderData).catch(() => { });
    }

    res.json({ success: true, order });
});

// PUT /api/orders/admin/:id/shipment - Admin add/update tracking
router.put('/admin/:id/shipment', adminAuth, async (req, res) => {
    const { tracking_id, courier_name, tracking_url, estimated_delivery } = req.body;
    const order = await Order.findByPk(req.params.id, {
        include: [{ model: User, as: 'user' }, { association: 'items' }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const [shipment, created] = await Shipment.findOrCreate({
        where: { order_id: order.id },
        defaults: { order_id: order.id },
    });
    await shipment.update({
        tracking_id,
        courier_name,
        tracking_url,
        estimated_delivery,
        shipped_at: !shipment.shipped_at ? new Date() : shipment.shipped_at,
    });

    await order.update({ tracking_id, courier_name, status: 'shipped' });

    const orderData = { ...order.toJSON(), user: order.user, tracking_id, courier_name };
    await emailService.sendOrderShipped(orderData).catch(() => { });
    await emailService.sendAdminOrderShipped(orderData).catch(() => { });

    res.json({ success: true, order, shipment });
});

// POST /api/orders/admin/:id/refund
router.post('/admin/:id/refund', adminAuth, async (req, res) => {
    const { amount } = req.body;
    const refund = await paymentService.initiateRefund(req.params.id, amount);
    res.json({ success: true, refund });
});

module.exports = router;
