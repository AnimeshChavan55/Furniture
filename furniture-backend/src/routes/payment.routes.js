const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/payments/validate-coupon
router.post('/validate-coupon', authenticate, async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    const [coupons] = await pool.query(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1
       AND (valid_from IS NULL OR valid_from <= CURDATE())
       AND (valid_until IS NULL OR valid_until >= CURDATE())
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [code]
    );

    if (!coupons.length) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const coupon = coupons[0];
    if (amount < coupon.min_purchase_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ₹${coupon.min_purchase_amount} for this coupon.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) discount = Math.min(discount, coupon.max_discount_amount);
    } else {
      discount = coupon.discount_value;
    }

    res.json({
      success: true,
      data: { coupon, discount_amount: discount, final_amount: amount - discount }
    });
  } catch (e) { next(e); }
});

// POST /api/payments/verify
router.post('/verify', authenticate, async (req, res, next) => {
  try {
    const { order_id, payment_id, amount } = req.body;
    await pool.query(
      "UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?",
      [order_id]
    );
    await pool.query(
      "INSERT INTO payments (order_id, user_id, payment_gateway, gateway_payment_id, amount, status) VALUES (?, ?, 'razorpay', ?, ?, 'completed')",
      [order_id, req.user.id, payment_id, amount]
    );
    await pool.query(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [order_id, 'Payment Confirmed', 'Your payment has been successfully processed.']
    );
    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (e) { next(e); }
});

module.exports = router;
