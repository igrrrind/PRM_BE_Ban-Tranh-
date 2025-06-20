const { StoreLocation } = require('../models');

// Get all store locations
exports.getAllStoreLocations = async (req, res) => {
  try {
    const locations = await StoreLocation.findAll();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single store location by id
exports.getStoreLocationById = async (req, res) => {
  try {
    const location = await StoreLocation.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: 'StoreLocation not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create store location
exports.createStoreLocation = async (req, res) => {
  try {
    const location = await StoreLocation.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update store location
exports.updateStoreLocation = async (req, res) => {
  try {
    const [updated] = await StoreLocation.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'StoreLocation not found' });
    const updatedLocation = await StoreLocation.findByPk(req.params.id);
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete store location
exports.deleteStoreLocation = async (req, res) => {
  try {
    const deleted = await StoreLocation.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'StoreLocation not found' });
    res.json({ message: 'StoreLocation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
