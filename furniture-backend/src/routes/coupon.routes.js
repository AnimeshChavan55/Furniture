const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

// GET /api/coupons/validate
router.get('/validate/:code', authenticate, async (req, res, next) => {
  try {
    const [coupons] = await pool.query(
      `SELECT id, code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount
       FROM coupons WHERE code = ? AND is_active = 1
       AND (valid_from IS NULL OR valid_from <= CURDATE())
       AND (valid_until IS NULL OR valid_until >= CURDATE())
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [req.params.code]
    );
    if (!coupons.length) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon.' });
    }
    res.json({ success: true, data: coupons[0] });
  } catch (e) { next(e); }
});

module.exports = router;
