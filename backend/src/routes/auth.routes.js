const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Admin } = require('../models');

const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return false;
    }
    return true;
};

// POST /api/auth/register
router.post(
    '/register',
    [
        body('name').notEmpty().trim(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }),
    ],
    async (req, res) => {
        if (!handleValidation(req, res)) return;
        const { name, email, password, phone } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });
        const user = await User.create({ name, email, password_hash: password, phone });
        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
    }
);

// POST /api/auth/login
router.post(
    '/login',
    [body('email').isEmail(), body('password').notEmpty()],
    async (req, res) => {
        if (!handleValidation(req, res)) return;
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (user.is_blocked) return res.status(403).json({ success: false, message: 'Account is blocked' });
        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
    }
);

// POST /api/auth/admin/login
router.post(
    '/admin/login',
    [body('email').isEmail(), body('password').notEmpty()],
    async (req, res) => {
        if (!handleValidation(req, res)) return;
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    }
);

module.exports = router;
