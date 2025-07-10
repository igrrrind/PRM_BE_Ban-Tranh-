const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


// Checkout endpoint (new workflow)
router.post('/checkout/:type', orderController.checkout);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/user/:userId', orderController.getOrdersByUserId);

module.exports = router;
