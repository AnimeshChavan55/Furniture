const express = require('express');
const router = express.Router();
const {
  createOrder, getUserOrders, getOrderById,
  cancelOrder, getAllOrders, updateOrderStatus
} = require('../controllers/order.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', authorizeAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', authorizeAdmin, updateOrderStatus);

module.exports = router;
