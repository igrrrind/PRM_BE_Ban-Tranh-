const { Product, Category } = require('../models');

// Get all products with category
exports.getAllProducts = async (req, res) => {
  try {
    const { search, categoryId, sort } = req.query;
    const where = {};
    if (search) {
      where.productName = { [require('sequelize').Op.like]: `%${search}%` };
    }
    if (categoryId) {
      where.categoryID = categoryId;
    }
    let order;
    if (sort === 'price_asc') {
      order = [['price', 'ASC']];
    } else if (sort === 'price_desc') {
      order = [['price', 'DESC']];
    }
    const findAllOptions = {
      where,
      include: [{ model: Category, as: 'category' }]
    };
    if (order) findAllOptions.order = order;
    const products = await Product.findAll(findAllOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by id with category
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { ProductID: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { ProductID: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
