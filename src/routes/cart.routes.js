const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');


router.get('/', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.get('/user/:userId', cartController.getCartByUserId);

// Cart item operations
router.post('/add-cart/:userId', cartController.addToCart); // Add product to cart
router.put('/update-cart/:userId', cartController.updateCartItem); // Update product quantity in cart
router.delete('/remove-item/:userId', cartController.removeFromCart); // Remove product from cart

module.exports = router;
