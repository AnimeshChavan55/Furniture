const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// POST /api/contact
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );
    res.json({ success: true, message: 'Your message has been sent. We will get back to you within 24 hours.' });
  } catch (e) { next(e); }
});

module.exports = router;
