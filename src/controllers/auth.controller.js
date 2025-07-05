const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address, role } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash: hash, email, phoneNumber, address, role });
    res.status(201).json({ message: 'User registered', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Helper to generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'refresh_secret',
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    const { accessToken, refreshToken } = generateTokens(user);
    // For browser: set httpOnly cookie. For mobile: return in JSON.
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Refresh token endpoint
exports.refresh = async (req, res) => {
  try {
    // Try to get refreshToken from cookie or body for mobile support
    let token = req.cookies.refreshToken;
    if (!token && req.body && req.body.refreshToken) {
      token = req.body.refreshToken;
    }
    if (!token) return res.status(401).json({ error: 'No refresh token' });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'refresh_secret');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Logout endpoint
exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
