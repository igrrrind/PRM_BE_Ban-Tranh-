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
        { model: CartItem, as: 'CartItems' }
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
exports.getCartsByUserId = async (req, res) => {
  try {
    const carts = await Cart.findAll({ where: { userID: req.params.userId } });
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
