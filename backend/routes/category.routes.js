const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const slugify = require('slugify');
const { Category } = require('../models');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const ALLOWED_SLUGS = ['sarees', 'suits', 'bags', 'accessories'];

router.get('/', async (req, res) => {
    const categories = await Category.findAll({
        where: { is_active: true, slug: { [Op.in]: ALLOWED_SLUGS } },
        order: [['name', 'ASC']],
    });
    res.json({ success: true, categories });
});

router.get('/:slug', async (req, res) => {
    const category = await Category.findOne({ where: { slug: req.params.slug, is_active: true } });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
});

router.post('/', adminAuth, upload.single('image'), async (req, res) => {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const category = await Category.create({ name, slug, description, image_url });
    res.status(201).json({ success: true, category });
});

router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const updates = { ...req.body };
    if (req.file) updates.image_url = `/uploads/${req.file.filename}`;
    if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
    await category.update(updates);
    res.json({ success: true, category });
});

router.delete('/:id', adminAuth, async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.update({ is_active: false });
    res.json({ success: true, message: 'Category deactivated' });
});

module.exports = router;
