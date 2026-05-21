const db = require('../config/db')

const createOrder = async (req, res, next) => {
  try {
    const { user_id, total, payment_method, shipping_address, items } = req.body
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total, payment_method, shipping_address, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, total, payment_method, shipping_address, 'pending', 'pending']
    )

    const orderId = result.insertId
    const itemQueries = items.map((item) => [orderId, item.product_id, item.quantity, item.price])
    await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [itemQueries])

    res.status(201).json({ id: orderId, message: 'Order created' })
  } catch (error) {
    next(error)
  }
}

const myOrders = async (req, res, next) => {
  try {
    const { userId } = req.params
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId])
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createOrder,
  myOrders,
}
