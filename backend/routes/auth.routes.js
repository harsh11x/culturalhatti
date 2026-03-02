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
        console.log('🔐 Admin login attempt:', email);
        
        const admin = await Admin.findOne({ where: { email } });
        console.log('👤 Admin found:', !!admin);
        
        if (!admin) {
            console.log('❌ Admin not found in database');
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        
        const passwordMatch = await admin.comparePassword(password);
        console.log('🔑 Password match:', passwordMatch);
        
        if (!passwordMatch) {
            console.log('❌ Password does not match');
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1d' });
        console.log('✅ Admin login successful');
        res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    }
);

// POST /api/auth/phone-auth - Phone number authentication via Firebase
router.post('/phone-auth', async (req, res) => {
    try {
        const { firebase_uid, phone, name } = req.body;
        if (!firebase_uid || !phone) {
            return res.status(400).json({ success: false, message: 'Firebase UID and phone required' });
        }

        let user = await User.findOne({ where: { firebase_uid } });
        
        if (!user) {
            user = await User.findOne({ where: { phone } });
            if (user) {
                await user.update({ firebase_uid });
            } else {
                user = await User.create({
                    firebase_uid,
                    phone,
                    name: name || 'User',
                    email: `${phone.replace(/\D/g, '')}@phone.culturalhatti.com`,
                    password_hash: Math.random().toString(36).slice(-16),
                });
            }
        }

        if (user.is_blocked) {
            return res.status(403).json({ success: false, message: 'Account is blocked' });
        }

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ success: true, token, _id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error('Phone auth error:', error);
        res.status(500).json({ success: false, message: 'Phone authentication failed' });
    }
});

// POST /api/auth/google-auth - Google authentication via Firebase
router.post('/google-auth', async (req, res) => {
    try {
        const { firebase_uid, email, name } = req.body;
        if (!firebase_uid || !email) {
            return res.status(400).json({ success: false, message: 'Firebase UID and email required' });
        }

        let user = await User.findOne({ where: { firebase_uid } });
        
        if (!user) {
            user = await User.findOne({ where: { email } });
            if (user) {
                await user.update({ firebase_uid });
            } else {
                user = await User.create({
                    firebase_uid,
                    email,
                    name: name || 'User',
                    password_hash: Math.random().toString(36).slice(-16),
                });
            }
        }

        if (user.is_blocked) {
            return res.status(403).json({ success: false, message: 'Account is blocked' });
        }

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ success: true, token, _id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ success: false, message: 'Google authentication failed' });
    }
});

module.exports = router;
