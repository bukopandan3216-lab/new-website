const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashed, 'buyer']
    )

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: result.insertId, full_name, email, role: 'buyer' } })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}
