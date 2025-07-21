const { Product } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity are required' });
    let cart = await Cart.findOne({ where: { userID: userId } });
    if (!cart) {
      cart = await Cart.create({ userID: userId, status: 'active', totalPrice: 0 });
    }
    // Get product price
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    let cartItem = await CartItem.findOne({ where: { cartID: cart.id, productID: productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = product.price;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartID: cart.id, productID: productId, quantity, price: product.price });
    }
    // Update cart total
    const allItems = await CartItem.findAll({ where: { cartID: cart.id } });
    const total = allItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.totalPrice = total;
    await cart.save();
    res.status(200).json({ id: cart.id,
        userID: cart.userID,
        status: cart.status,
        totalPrice: cart.totalPrice
        , CartItems: allItems });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update cart item quantity (PUT /update-cart/:userId)
exports.updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity are required' });
    const cart = await Cart.findOne({ where: { userID: userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const cartItem = await CartItem.findOne({ where: { cartID: cart.id, productID: productId } });
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    cartItem.quantity = quantity;
    await cartItem.save();

    // Update cart total
    const allItems = await CartItem.findAll({ where: { cartID: cart.id } });
    const total = allItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.totalPrice = total;
    await cart.save();
    res.json({
      message: 'Cart item updated successfully',
      cartItem,
      cartTotal: cart.totalPrice
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove product from cart (DELETE /remove-item/:userId)
exports.removeFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    const cart = await Cart.findOne({ where: { userID: userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const cartItem = await CartItem.findOne({ where: { cartID: cart.id, productID: productId } });
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    await cartItem.destroy();
    
    const allItems = await CartItem.findAll({ where: { cartID: cart.id } });
    const total = allItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.totalPrice = total;
    await cart.save();

    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const { Cart, User, CartItem } = require('../models');

// Get all carts with user and items
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [
        { model: User, as: 'User' },
        { model: CartItem, as: 'CartItems' }
      ]
    });
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single cart by id
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id, {
      include: [
        { model: User, as: 'User' },
        { model: CartItem, as: 'CartItems', include: [{ model: Product, as: 'Product' }] }
      ]
    });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create cart
exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update cart
exports.updateCart = async (req, res) => {
  try {
    const [updated] = await Cart.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Cart not found' });
    const updatedCart = await Cart.findByPk(req.params.id);
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete cart
exports.deleteCart = async (req, res) => {
  try {
    const deleted = await Cart.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Cart not found' });
    res.json({ message: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get carts by user ID
exports.getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userID: req.params.userId },
      include: [{ model: CartItem, as: 'CartItems', include: [{ model: Product, as: 'Product' }] }]
    });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    // Recalculate total from items for accuracy
    const total = (cart.CartItems || []).reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.totalPrice = total;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
