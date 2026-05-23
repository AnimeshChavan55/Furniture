const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');

router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, phone, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    const [addresses] = await pool.query('SELECT * FROM user_addresses WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, data: { ...rows[0], addresses } });
  } catch (e) { next(e); }
});

// PUT /api/users/profile
router.put('/profile', async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;
    await pool.query('UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
      [first_name, last_name, phone, req.user.id]);
    res.json({ success: true, message: 'Profile updated.' });
  } catch (e) { next(e); }
});

// POST /api/users/addresses
router.post('/addresses', async (req, res, next) => {
  try {
    const { address_type, full_name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;
    if (is_default) {
      await pool.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
    }
    const [result] = await pool.query(
      'INSERT INTO user_addresses (user_id, address_type, full_name, phone, address_line1, address_line2, city, state, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, address_type || 'home', full_name, phone, address_line1, address_line2 || null, city, state, pincode, is_default || false]
    );
    res.status(201).json({ success: true, message: 'Address added.', data: { id: result.insertId } });
  } catch (e) { next(e); }
});

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Address deleted.' });
  } catch (e) { next(e); }
});

// GET /api/users/notifications
router.get('/notifications', async (req, res, next) => {
  try {
    const [notifs] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ success: true, data: notifs });
  } catch (e) { next(e); }
});

module.exports = router;
