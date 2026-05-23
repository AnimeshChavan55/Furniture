const express = require('express');
const router = express.Router();
const {
  getProducts, getProductBySlug, createProduct,
  updateProduct, deleteProduct, getFeaturedProducts
} = require('../controllers/product.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorizeAdmin, upload.single('thumbnail'), createProduct);
router.put('/:id', authenticate, authorizeAdmin, upload.single('thumbnail'), updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
