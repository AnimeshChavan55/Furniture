const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// GET /api/reviews/product/:product_id
router.get('/product/:product_id', async (req, res, next) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC`,
      [req.params.product_id]
    );
    res.json({ success: true, data: reviews });
  } catch (e) { next(e); }
});

// POST /api/reviews
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { product_id, order_id, rating, title, review_text } = req.body;

    // Check if user already reviewed
    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [product_id, req.user.id]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, order_id, rating, title, review_text, is_verified_purchase) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_id, req.user.id, order_id || null, rating, title || null, review_text || null, order_id ? true : false]
    );

    // Update product rating
    const [[ratingData]] = await pool.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM reviews WHERE product_id = ? AND is_approved = 1',
      [product_id]
    );

    await pool.query(
      'UPDATE products SET average_rating = ?, total_reviews = ? WHERE id = ?',
      [ratingData.avg_rating || 0, ratingData.total || 0, product_id]
    );

    res.status(201).json({ success: true, message: 'Review submitted! It will be published after approval.' });
  } catch (e) { next(e); }
});

// Admin: GET /api/reviews/admin/pending
router.get('/admin/pending', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, p.name AS product_name
       FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id
       WHERE r.is_approved = 0 ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: reviews });
  } catch (e) { next(e); }
});

// Admin: PATCH /api/reviews/:id/approve
router.patch('/:id/approve', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    await pool.query('UPDATE reviews SET is_approved = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review approved.' });
  } catch (e) { next(e); }
});

module.exports = router;
