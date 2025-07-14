const { Order, OrderItem, Product, Cart, User, Payment } = require('../models');
const vnpay = require('../config/vnpay.config');

exports.checkout = async (req, res) => {
  try {
    const { userId, cartId, billingAddress } = req.body;
    const { type } = req.params; // 'CashOnDelivery' or 'VNPay'

    if (!userId || !cartId || !type) {
      return res.status(400).json({ error: 'userId, cartId, and type are required' });
    }

    // Tìm giỏ hàng
    const cart = await Cart.findOne({
      where: { id: cartId, userID: userId },
      include: ['CartItems']
    });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    if (!cart.CartItems || cart.CartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Tính tổng tiền
    let totalAmount = cart.totalPrice
    // for (const item of cart.CartItems) {
    //   let price = item.price;
    //   if (price == null) {
    //     const product = await Product.findByPk(item.productID);
    //     price = product ? product.price : 0;
    //   }
    //   totalAmount += price * item.quantity;
    // }

    // Nếu CashOnDelivery
    if (type === 'CashOnDelivery') {
      const order = await Order.create({
        userID: userId,
        billingAddress,
        orderStatus: 'processing',
        paymentMethod: 'CashOnDelivery',
        orderDate: new Date()
      });

      for (const item of cart.CartItems) {
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

      await CartItem.destroy({ where: { cartID: cartId } });

      return res.json({ success: true, orderId: order.id });
    }

    // Nếu VNPay
    if (type === 'VNPay') {
      // Tính tổng tiền
      let totalAmount = cart.totalPrice
    
      // Lưu tạm cartId + userId trong vnp_TxnRef để dùng lại
      const vnp_TxnRef = `${cartId}_${userId}_${Date.now()}`; // ví dụ: 5_2_175239xxxx
    
      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalAmount,
        vnp_IpAddr: req.ip,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL,
        vnp_TxnRef,
        vnp_OrderInfo: `Thanh toán đơn hàng qua VNPay`,
      });
    
      return res.json({ success: true, paymentUrl });
    }
    

    return res.status(400).json({ error: 'Invalid checkout type' });
  } catch (err) {
    console.error('[checkout error]', err);
    return res.status(500).json({ error: err.message });
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
    const { userID, orderStatus, paymentMethod, orderDate, total } = req.body;
    const order = await Order.create({ userID, orderStatus, paymentMethod, orderDate, total });
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
