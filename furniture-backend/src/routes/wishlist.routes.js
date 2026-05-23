const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT w.id, w.created_at,
              p.id AS product_id, p.name, p.slug, p.base_price, p.sale_price, p.thumbnail, p.average_rating
       FROM wishlist w JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ? ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: items });
  } catch (e) { next(e); }
});

// POST /api/wishlist
router.post('/', async (req, res, next) => {
  try {
    const { product_id } = req.body;
    await pool.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );
    res.json({ success: true, message: 'Added to wishlist.' });
  } catch (e) { next(e); }
});

// DELETE /api/wishlist/:product_id
router.delete('/:product_id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.product_id]);
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (e) { next(e); }
});

module.exports = router;
