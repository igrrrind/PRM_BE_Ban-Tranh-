const { ChatMessage, User } = require('../models');

// Get all chat messages with user
exports.getAllChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      include: [{ model: User, as: 'User' }]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single chat message by id
exports.getChatMessageById = async (req, res) => {
  try {
    const message = await ChatMessage.findByPk(req.params.id, {
      include: [{ model: User, as: 'User' }]
    });
    if (!message) return res.status(404).json({ error: 'ChatMessage not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create chat message
exports.createChatMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update chat message
exports.updateChatMessage = async (req, res) => {
  try {
    const [updated] = await ChatMessage.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'ChatMessage not found' });
    const updatedMessage = await ChatMessage.findByPk(req.params.id);
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete chat message
exports.deleteChatMessage = async (req, res) => {
  try {
    const deleted = await ChatMessage.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'ChatMessage not found' });
    res.json({ message: 'ChatMessage deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get chat messages by user ID
exports.getChatMessagesByUserId = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({ where: { userID: req.params.userId } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
