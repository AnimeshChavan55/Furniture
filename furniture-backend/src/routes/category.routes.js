const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const [cats] = await pool.query('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order');
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [cats] = await pool.query('SELECT * FROM categories WHERE slug = ? AND is_active = 1', [req.params.slug]);
    if (!cats.length) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: cats[0] });
  } catch (e) { next(e); }
});

module.exports = router;
