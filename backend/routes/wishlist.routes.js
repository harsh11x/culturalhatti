const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { Wishlist, Product, Category } = require('../models');

// GET /api/wishlist/ids - Lightweight: product IDs only (for product page checks)
router.get('/ids', authenticate, async (req, res) => {
    const rows = await Wishlist.findAll({
        where: { user_id: req.user.id },
        attributes: ['product_id'],
    });
    res.json({ success: true, product_ids: rows.map((r) => r.product_id) });
});

// GET /api/wishlist - List user's wishlist
router.get('/', authenticate, async (req, res) => {
    const items = await Wishlist.findAll({
        where: { user_id: req.user.id },
        include: [{ model: Product, include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }] }],
    });
    res.json({ success: true, items });
});

// POST /api/wishlist - Add to wishlist
router.post('/', authenticate, async (req, res) => {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ success: false, message: 'product_id required' });
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) return res.status(404).json({ success: false, message: 'Product not found' });
    const [item] = await Wishlist.findOrCreate({
        where: { user_id: req.user.id, product_id },
        defaults: { user_id: req.user.id, product_id },
    });
    res.status(201).json({ success: true, item });
});

// DELETE /api/wishlist/:product_id - Remove from wishlist
router.delete('/:product_id', authenticate, async (req, res) => {
    const deleted = await Wishlist.destroy({
        where: { user_id: req.user.id, product_id: req.params.product_id },
    });
    if (!deleted) return res.status(404).json({ success: false, message: 'Not in wishlist' });
    res.json({ success: true });
});

module.exports = router;
