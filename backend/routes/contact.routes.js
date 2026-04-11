const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/contact — public contact form → CONTACT_INBOX_EMAIL
router.post(
    '/',
    [
        body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
        body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }),
        body('message').trim().isLength({ min: 10, max: 8000 }).withMessage('Message must be at least 10 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0]?.msg || 'Invalid input',
                errors: errors.array(),
            });
        }
        const { name, email, phone, message } = req.body;
        try {
            await emailService.sendContactFormSubmission({ name, email, phone: phone || '', message });
            res.json({ success: true, message: 'Thank you. We will get back to you soon.' });
        } catch (e) {
            logger.error('Contact form email failed', { error: e.message });
            res.status(502).json({
                success: false,
                message: 'We could not send your message right now. Please email us directly or try again later.',
            });
        }
    }
);

module.exports = router;
