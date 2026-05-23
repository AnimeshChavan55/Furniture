/**
 * Order Controller
 * Handles order creation, tracking, and management
 */
const { pool } = require('../config/database');
const uuidv4 = () => require('crypto').randomUUID();

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `CC-${timestamp}-${random}`;
};

// POST /api/orders  - Place new order
const createOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      items, shipping_address, payment_method = 'online',
      coupon_code, notes
    } = req.body;

    if (!items || !items.length || !shipping_address) {
      return res.status(400).json({ success: false, message: 'Order items and shipping address required.' });
    }

    // Validate and calculate prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await conn.query(
        'SELECT id, name, base_price, sale_price, stock_quantity, thumbnail, sku FROM products WHERE id = ? AND is_active = 1',
        [item.product_id]
      );

      if (!products.length) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Product ID ${item.product_id} not found.` });
      }

      const product = products[0];
      if (product.stock_quantity < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      const unitPrice = item.custom_price || product.sale_price || product.base_price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        customization_details: item.customization_details || null,
        thumbnail: product.thumbnail
      });
    }

    // Apply coupon
    let discountAmount = 0;
    let appliedCoupon = null;
    if (coupon_code) {
      const [coupons] = await conn.query(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1
         AND (valid_from IS NULL OR valid_from <= CURDATE())
         AND (valid_until IS NULL OR valid_until >= CURDATE())
         AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [coupon_code]
      );

      if (coupons.length) {
        const coupon = coupons[0];
        if (subtotal >= coupon.min_purchase_amount) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
          } else {
            discountAmount = coupon.discount_value;
          }
          appliedCoupon = coupon;
        }
      }
    }

    const taxAmount = subtotal * 0.18; // 18% GST
    const shippingAmount = subtotal > 25000 ? 0 : 999; // Free shipping above 25K
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 21); // 3 weeks for custom furniture

    // Create order
    const orderNumber = generateOrderNumber();
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, user_id, subtotal, tax_amount, shipping_amount, discount_amount,
        total_amount, coupon_code, shipping_address, payment_method, estimated_delivery, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, req.user.id, subtotal, taxAmount, shippingAmount, discountAmount,
       totalAmount, coupon_code || null, JSON.stringify(shipping_address),
       payment_method, estimatedDelivery, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items and update stock
    for (const item of orderItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, customization_details, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.quantity, item.unit_price,
         item.total_price, item.customization_details ? JSON.stringify(item.customization_details) : null, item.thumbnail]
      );

      await conn.query(
        'UPDATE products SET stock_quantity = stock_quantity - ?, total_sold = total_sold + ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }

    // Add tracking entry
    await conn.query(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'Order Placed', 'Your order has been placed successfully and is being confirmed.']
    );

    // Update coupon usage
    if (appliedCoupon) {
      await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [appliedCoupon.id]);
    }

    // Clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        order_id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount,
        estimated_delivery: estimatedDelivery
      }
    });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

// GET /api/orders  - Get user orders
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE o.user_id = ?';
    const params = [req.user.id];

    if (status) { where += ' AND o.status = ?'; params.push(status); }

    const [orders] = await pool.query(
      `SELECT o.id, o.order_number, o.status, o.total_amount, o.payment_status,
              o.created_at, o.estimated_delivery,
              COUNT(oi.id) AS item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM orders o ${where}`, params);

    res.json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    const [tracking] = await pool.query('SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at', [req.params.id]);

    res.json({ success: true, data: { ...orders[0], items, tracking } });
  } catch (error) { next(error); }
};

// PATCH /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found.' });

    const order = orders[0];
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' });
    }

    await pool.query(
      "UPDATE orders SET status = 'cancelled', cancelled_at = NOW(), cancel_reason = ? WHERE id = ?",
      [req.body.reason || 'Cancelled by user', req.params.id]
    );

    await pool.query(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [req.params.id, 'Cancelled', req.body.reason || 'Order cancelled by customer.']
    );

    res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (error) { next(error); }
};

// Admin: GET /api/orders/admin/all
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];

    if (status) { where += ' AND o.status = ?'; params.push(status); }
    if (search) {
      where += ' AND (o.order_number LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [orders] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o JOIN users u ON o.user_id = u.id
       ${where}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM orders o JOIN users u ON o.user_id = u.id ${where}`,
      params
    );

    res.json({ success: true, data: orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// Admin: PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, description, location } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    await pool.query(
      'INSERT INTO order_tracking (order_id, status, description, location) VALUES (?, ?, ?, ?)',
      [req.params.id, status, description || `Status updated to ${status}`, location || null]
    );
    res.json({ success: true, message: 'Order status updated.' });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus };
