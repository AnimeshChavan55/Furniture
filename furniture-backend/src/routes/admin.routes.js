const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.use(authenticate, authorizeAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'");
    const [[{ total_orders }]] = await pool.query("SELECT COUNT(*) AS total_orders FROM orders");
    const [[{ total_revenue }]] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE payment_status = 'paid'");
    const [[{ total_products }]] = await pool.query("SELECT COUNT(*) AS total_products FROM products WHERE is_active = 1");
    const [[{ pending_orders }]] = await pool.query("SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'pending'");

    const [monthly_sales] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
              COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders WHERE payment_status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month`
    );

    const [top_products] = await pool.query(
      `SELECT p.name, p.thumbnail, p.total_sold, p.base_price,
              COALESCE(SUM(oi.total_price), 0) AS revenue
       FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id ORDER BY p.total_sold DESC LIMIT 5`
    );

    const [recent_orders] = await pool.query(
      `SELECT o.order_number, o.status, o.total_amount, o.created_at,
              u.first_name, u.last_name
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 5`
    );

    const [order_status_dist] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM orders GROUP BY status"
    );

    res.json({
      success: true,
      data: {
        stats: { total_users, total_orders, total_revenue, total_products, pending_orders },
        monthly_sales,
        top_products,
        recent_orders,
        order_status_dist
      }
    });
  } catch (e) { next(e); }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;
    let where = "WHERE role != 'admin'";
    const params = [];

    if (search) { where += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (role) { where += ' AND role = ?'; params.push(role); }

    const [users] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, role, is_active, created_at, last_login FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);

    res.json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
});

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const { is_active } = req.body;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
    res.json({ success: true, message: `User ${is_active ? 'activated' : 'deactivated'}.` });
  } catch (e) { next(e); }
});

// GET /api/admin/inventory
router.get('/inventory', async (req, res, next) => {
  try {
    const [inv] = await pool.query(
      `SELECT i.*, p.name, p.sku, p.thumbnail, c.name AS category_name
       FROM inventory i JOIN products p ON i.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = 1 ORDER BY i.quantity_available ASC`
    );
    res.json({ success: true, data: inv });
  } catch (e) { next(e); }
});

// PUT /api/admin/inventory/:product_id
router.put('/inventory/:product_id', async (req, res, next) => {
  try {
    const { quantity_available, reorder_level } = req.body;
    await pool.query(
      'UPDATE inventory SET quantity_available = ?, reorder_level = ?, last_restocked = NOW() WHERE product_id = ?',
      [quantity_available, reorder_level, req.params.product_id]
    );
    await pool.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [quantity_available, req.params.product_id]);
    res.json({ success: true, message: 'Inventory updated.' });
  } catch (e) { next(e); }
});

// GET /api/admin/reports/sales
router.get('/reports/sales', async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    let where = "WHERE o.payment_status = 'paid'";
    const params = [];

    if (start_date) { where += ' AND o.created_at >= ?'; params.push(start_date); }
    if (end_date) { where += ' AND o.created_at <= ?'; params.push(end_date + ' 23:59:59'); }

    const [[revenue]] = await pool.query(`SELECT SUM(total_amount) AS total, COUNT(*) AS orders, AVG(total_amount) AS avg FROM orders o ${where}`, params);
    const [by_category] = await pool.query(
      `SELECT c.name, SUM(oi.total_price) AS revenue, COUNT(oi.id) AS items_sold
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       JOIN orders o ON oi.order_id = o.id ${where}
       GROUP BY c.id ORDER BY revenue DESC`, params
    );

    res.json({ success: true, data: { revenue, by_category } });
  } catch (e) { next(e); }
});

// GET /api/admin/contacts
router.get('/contacts', async (req, res, next) => {
  try {
    const [msgs] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, data: msgs });
  } catch (e) { next(e); }
});

// Categories CRUD (Admin)
router.post('/categories', async (req, res, next) => {
  try {
    const { name, description, parent_id, sort_order } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description || null, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ success: true, message: 'Category created.', data: { id: result.insertId } });
  } catch (e) { next(e); }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const { name, description, is_active } = req.body;
    await pool.query('UPDATE categories SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description, is_active, req.params.id]);
    res.json({ success: true, message: 'Category updated.' });
  } catch (e) { next(e); }
});

module.exports = router;
