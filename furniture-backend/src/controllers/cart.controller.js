/**
 * Cart Controller
 */
const { pool } = require('../config/database');

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT c.id, c.quantity, c.customization_details, c.custom_price,
              p.id AS product_id, p.name, p.slug, p.base_price, p.sale_price,
              p.thumbnail, p.stock_quantity, p.is_active
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    let subtotal = 0;
    const cartItems = items.map(item => {
      const price = item.custom_price || item.sale_price || item.base_price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      return { ...item, unit_price: price, item_total: itemTotal };
    });

    const tax = subtotal * 0.18;
    const shipping = subtotal > 25000 ? 0 : 999;

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          subtotal,
          tax,
          shipping,
          total: subtotal + tax + shipping,
          item_count: items.length
        }
      }
    });
  } catch (error) { next(error); }
};

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1, customization_details, custom_price } = req.body;

    // Check existing cart item
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length) {
      await pool.query(
        'UPDATE cart SET quantity = quantity + ?, customization_details = ?, custom_price = ? WHERE id = ?',
        [quantity, customization_details ? JSON.stringify(customization_details) : null, custom_price || null, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity, customization_details, custom_price) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, product_id, quantity, customization_details ? JSON.stringify(customization_details) : null, custom_price || null]
      );
    }

    res.json({ success: true, message: 'Item added to cart.' });
  } catch (error) { next(error); }
};

// PUT /api/cart/:id
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ success: true, message: 'Cart updated.' });
  } catch (error) { next(error); }
};

// DELETE /api/cart/:id
const removeFromCart = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (error) { next(error); }
};

// DELETE /api/cart  - Clear cart
const clearCart = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) { next(error); }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
