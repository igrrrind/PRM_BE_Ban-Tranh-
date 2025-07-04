const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.get('/user/:userId', cartController.getCartsByUserId);

module.exports = router;
