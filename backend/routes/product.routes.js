const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const slugify = require('slugify');
const { Product, Category } = require('../models');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// GET /api/products - Public listing with filters
router.get('/', async (req, res) => {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    const where = { is_active: true };
    if (category) where['$category.slug$'] = category;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (featured === 'true') where.featured = true;
    const products = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...products, page: parseInt(page) });
});

// GET /api/products/admin/all - Admin: View all products (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
    const { category, search, featured, page = 1, limit = 100 } = req.query;
    const where = {};
    if (category) where.category_id = category;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (featured === 'true') where.featured = true;
    const products = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...products, page: parseInt(page) });
});

// GET /api/products/admin/:id - Admin: Get product by ID for editing
router.get('/admin/:id', adminAuth, async (req, res) => {
    const product = await Product.findOne({
        where: { id: req.params.id },
        include: [{ model: Category, as: 'category' }],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
    const product = await Product.findOne({
        where: { slug: req.params.slug, is_active: true },
        include: [{ model: Category, as: 'category' }],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
});

// POST /api/products - Admin only
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
    const { name, description, price, compare_price, stock, category_id, tags, featured, weight_grams, sku } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const images = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const product = await Product.create({
        name, slug, description, price, compare_price, stock: stock || 0,
        category_id, images, featured: featured === 'true',
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
        weight_grams, sku,
    });
    res.status(201).json({ success: true, product });
});

// PUT /api/products/:id - Admin only
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const updates = { ...req.body };
    if (req.files?.length) updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
    await product.update(updates);
    res.json({ success: true, product });
});

// DELETE /api/products/:id - Admin only
router.delete('/:id', adminAuth, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.update({ is_active: false });
    res.json({ success: true, message: 'Product deactivated' });
});

module.exports = router;
