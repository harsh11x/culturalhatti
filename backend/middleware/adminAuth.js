const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Admin authentication required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (decoded.type === 'hardcoded' || decoded.id === 'admin') {
            req.admin = { id: decoded.id, role: decoded.role || 'superadmin', name: 'Admin', email: process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@culturalhatti.in' };
            return next();
        }
        const { Admin } = require('../models');
        const admin = await Admin.findByPk(decoded.id);
        if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired admin token' });
    }
};

module.exports = adminAuth;
