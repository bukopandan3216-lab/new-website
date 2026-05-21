const db = require('../config/db')

const getProducts = async (req, res, next) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE status = ?', ['active'])
    res.json(products)
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id])
    const product = products[0]
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, store_id } = req.body
    const image = req.file ? req.file.filename : null
    const [result] = await db.query(
      'INSERT INTO products (store_id, name, description, category, price, stock, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [store_id || null, name, description, category, price, stock, image, 'active']
    )
    res.status(201).json({ id: result.insertId, name, description, category, price, stock, image })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
}
