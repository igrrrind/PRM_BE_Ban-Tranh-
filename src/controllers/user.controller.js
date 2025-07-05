const db = require('../models');

const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        db.Cart,
        db.Order,
        db.Notification,
        db.ChatMessage
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create user
const createUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address, role } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'username, password, and email are required' });
    }
    // Check for existing username or email
    const existing = await db.User.findOne({ where: { username } }) || await db.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Username or email already exists' });
    // Hash password
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ username, passwordHash: hash, email, phoneNumber, address, role });
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
