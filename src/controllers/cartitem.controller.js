const { CartItem, Cart, Product } = require('../models');

// Get all cart items with cart and product
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [
        { model: Cart, as: 'Cart' },
        { model: Product, as: 'Product' }
      ]
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single cart item by id
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [
        { model: Cart, as: 'Cart' },
        { model: Product, as: 'Product' }
      ]
    });
    if (!cartItem) return res.status(404).json({ error: 'CartItem not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create cart item
exports.createCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.create(req.body);
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const [updated] = await CartItem.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'CartItem not found' });
    const updatedCartItem = await CartItem.findByPk(req.params.id);
    res.json(updatedCartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete cart item
exports.deleteCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'CartItem not found' });
    res.json({ message: 'CartItem deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
