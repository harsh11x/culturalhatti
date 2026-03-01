const express = require('express');
const router = express.Router();
const { Op, fn, col, literal } = require('sequelize');
const adminAuth = require('../middleware/adminAuth');
const authenticate = require('../middleware/auth');
const { User, Order, Payment } = require('../models');

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
    res.json({ success: true, user: { id: req.user.id, name: req.user.name, email: req.user.email, phone: req.user.phone } });
});

// PUT /api/users/me
router.put('/me', authenticate, async (req, res) => {
    const { name, phone } = req.body;
    await req.user.update({ name, phone });
    res.json({ success: true, user: req.user });
});

// PUT /api/users/me/password
router.put('/me/password', authenticate, async (req, res) => {
    const { current_password, new_password } = req.body;
    if (!await req.user.comparePassword(current_password)) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
    await req.user.update({ password_hash: new_password });
    res.json({ success: true, message: 'Password updated' });
});

// ─── ADMIN USER MANAGEMENT ─────

// GET /api/users/admin/all
router.get('/admin/all', adminAuth, async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }];
    const users = await User.findAndCountAll({
        where, attributes: { exclude: ['password_hash'] },
        limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...users });
});

// PUT /api/users/admin/:id/block
router.put('/admin/:id/block', adminAuth, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.update({ is_blocked: !user.is_blocked });
    res.json({ success: true, is_blocked: user.is_blocked });
});

// PUT /api/users/admin/:id/reset-password
router.put('/admin/:id/reset-password', adminAuth, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const newPassword = Math.random().toString(36).slice(-8);
    await user.update({ password_hash: newPassword });
    res.json({ success: true, message: 'Password reset', temp_password: newPassword });
});

// GET /api/users/admin/analytics
router.get('/admin/analytics', adminAuth, async (req, res) => {
    const [totalRevenue] = await Order.findAll({
        where: { status: { [Op.in]: ['confirmed', 'processing', 'shipped', 'delivered'] } },
        attributes: [[fn('SUM', col('total_amount')), 'total']],
        raw: true,
    });
    const totalPaid = await Order.count({ where: { status: { [Op.in]: ['confirmed', 'processing', 'shipped', 'delivered'] } } });
    const pendingPayment = await Order.count({ where: { status: 'pending_payment' } });
    const cancelled = await Order.count({ where: { status: 'cancelled' } });
    const refunded = await Order.count({ where: { status: 'refunded' } });
    const totalUsers = await User.count();
    res.json({
        success: true,
        analytics: {
            total_revenue: parseFloat(totalRevenue?.total || 0).toFixed(2),
            total_paid_orders: totalPaid,
            pending_payments: pendingPayment,
            cancelled_orders: cancelled,
            refunded_orders: refunded,
            total_users: totalUsers,
        },
    });
});

module.exports = router;
