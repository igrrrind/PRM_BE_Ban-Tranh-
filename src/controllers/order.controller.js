const { Order, OrderItem, Product, Cart, User, Payment } = require('../models');

  exports.checkout = async (req, res) => {
    try {
      const { userId, cartId, billingAddress } = req.body;
      const { type } = req.params; // 'CashOnDelivery' or 'Momo'
      if (!userId || !cartId || !type) return res.status(400).json({ error: 'userId, cartId, and type are required' });

      if (type === 'CashOnDelivery') {
        // Find cart and items
        const cart = await Cart.findOne({ where: { id: cartId, userID: userId }, include: ['CartItems'] });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        if (!cart.CartItems || cart.CartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        // Create order (no cartID)
        const order = await Order.create({
          userID: userId,
          billingAddress,
          orderStatus: 'processing',
          paymentMethod: 'CashOnDelivery',
          orderDate: new Date()
        });

        // Convert cart items to order items
        for (const item of cart.CartItems) {
          // Optionally fetch product price if not stored in cart item
          let price = item.price;
          if (price == null) {
            const product = await Product.findByPk(item.productID);
            price = product ? product.price : 0;
          }
          await OrderItem.create({
            orderID: order.id,
            productID: item.productID,
            quantity: item.quantity,
            price
          });
        }

        // Clear cart items after successful checkout
        await CartItem.destroy({ where: { cartID: cartId } });
        return res.json({ success: true, orderId: order.id });
      }

      if (type === 'Momo') {
        // For now, just return a success message
        return res.json({ success: true, message: 'Momo checkout simulated.' });
      }

      return res.status(400).json({ error: 'Invalid checkout type' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Get all orders with cart, user, and payment
  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: User, as: 'User' },
          { model: Payment, as: 'Payment' },
          { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] }
        ]
      });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get single order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'User' },
        { model: Payment, as: 'Payment' },
        { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] }
      ]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { userID, orderStatus, paymentMethod, orderDate } = req.body;
    const order = await Order.create({ userID, orderStatus, paymentMethod, orderDate });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { userID, orderStatus, paymentMethod, orderDate } = req.body;
    const [updated] = await Order.update({ userID, orderStatus, paymentMethod, orderDate }, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const updatedOrder = await Order.findByPk(req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userID: req.params.userId },
      include: [
        { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
