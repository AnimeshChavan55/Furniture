/**
 * Product Controller
 * Handles product CRUD, search, filters, and customization options
 */
const { pool } = require('../config/database');

// GET /api/products  - List products with filters/pagination
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, category, search,
      min_price, max_price, sort = 'created_at',
      order = 'DESC', featured, customizable
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.is_active = 1';
    const params = [];

    if (category) { whereClause += ' AND c.slug = ?'; params.push(category); }
    if (search) { whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (min_price) { whereClause += ' AND COALESCE(p.sale_price, p.base_price) >= ?'; params.push(min_price); }
    if (max_price) { whereClause += ' AND COALESCE(p.sale_price, p.base_price) <= ?'; params.push(max_price); }
    if (featured === 'true') { whereClause += ' AND p.is_featured = 1'; }
    if (customizable === 'true') { whereClause += ' AND p.is_customizable = 1'; }

    const allowedSorts = ['created_at', 'base_price', 'average_rating', 'total_sold', 'name'];
    const sortCol = allowedSorts.includes(sort) ? `p.${sort}` : 'p.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [products] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.sale_price,
              p.thumbnail, p.is_featured, p.is_customizable, p.average_rating, p.total_reviews,
              p.stock_quantity, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY ${sortCol} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

// GET /api/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = 1`,
      [req.params.slug]
    );

    if (!products.length) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = products[0];

    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [product.id]
    );

    const [options] = await pool.query(
      'SELECT * FROM product_customization_options WHERE product_id = ? AND is_available = 1 ORDER BY option_type, sort_order',
      [product.id]
    );

    const [reviews] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.avatar
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT 10`,
      [product.id]
    );

    // Group customization options by type
    const customizationGroups = options.reduce((acc, opt) => {
      if (!acc[opt.option_type]) acc[opt.option_type] = [];
      acc[opt.option_type].push(opt);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { ...product, images, customization_options: customizationGroups, reviews }
    });
  } catch (error) { next(error); }
};

// POST /api/products (Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      category_id, name, description, short_description,
      base_price, sale_price, sku, stock_quantity,
      is_featured, is_customizable, weight,
      dimensions_length, dimensions_width, dimensions_height
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const thumbnail = req.file ? `/uploads/products/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, slug, description, short_description, base_price, sale_price, sku, stock_quantity, thumbnail, is_featured, is_customizable, weight, dimensions_length, dimensions_width, dimensions_height)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, slug, description, short_description, base_price, sale_price || null, sku || null, stock_quantity || 0, thumbnail, is_featured || false, is_customizable !== false, weight || null, dimensions_length || null, dimensions_width || null, dimensions_height || null]
    );

    // Create inventory record
    await pool.query(
      'INSERT INTO inventory (product_id, quantity_available) VALUES (?, ?)',
      [result.insertId, stock_quantity || 0]
    );

    res.status(201).json({ success: true, message: 'Product created successfully.', data: { id: result.insertId } });
  } catch (error) { next(error); }
};

// PUT /api/products/:id (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (req.file) {
      updates.thumbnail = `/uploads/products/${req.file.filename}`;
    }

    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, values);
    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) { next(error); }
};

// DELETE /api/products/:id (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) { next(error); }
};

// GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.sale_price,
              p.thumbnail, p.average_rating, p.total_reviews, c.name AS category_name
       FROM products p JOIN categories c ON p.category_id = c.id
       WHERE p.is_featured = 1 AND p.is_active = 1
       ORDER BY p.total_sold DESC LIMIT 8`
    );
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, getFeaturedProducts };
