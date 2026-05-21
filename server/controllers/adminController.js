const db = require('../config/db')

// Get all users with filters
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query
    let query = 'SELECT id, username, email, full_name, role, status, created_at FROM users'
    const params = []

    const conditions = []
    if (role) {
      conditions.push('role = ?')
      params.push(role)
    }
    if (status) {
      conditions.push('status = ?')
      params.push(status)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY created_at DESC'

    const [users] = await db.query(query, params)
    res.json(users)
  } catch (error) {
    next(error)
  }
}

// Get pending applications
const getPendingApplications = async (req, res, next) => {
  try {
    const { type } = req.query // 'farmer' or 'buyer'
    let query = `
      SELECT u.id, u.username, u.email, u.full_name, u.role, u.profile_pic, 
             u.status, u.created_at
      FROM users u
      WHERE u.status = 'pending'
    `
    const params = []

    if (type) {
      query += ' AND u.role = ?'
      params.push(type)
    }

    query += ' ORDER BY u.created_at ASC'

    const [applications] = await db.query(query, params)

    // Get additional details
    const enrichedApps = await Promise.all(
      applications.map(async (app) => {
        if (app.role === 'farmer') {
          const [farmer] = await db.query(
            'SELECT store_name, farm_location, province, id_photo, bio FROM farmer_profiles WHERE user_id = ?',
            [app.id]
          )
          return { ...app, details: farmer[0] || {} }
        } else {
          const [buyer] = await db.query(
            'SELECT delivery_address, city, id_photo FROM buyer_profiles WHERE user_id = ?',
            [app.id]
          )
          return { ...app, details: buyer[0] || {} }
        }
      })
    )

    res.json(enrichedApps)
  } catch (error) {
    next(error)
  }
}

// Verify user (approve or reject)
const verifyUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { action } = req.body // 'approve' or 'reject'

    const status = action === 'approve' ? 'active' : 'rejected'

    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId])

    res.json({ message: `User ${action}ed successfully` })
  } catch (error) {
    next(error)
  }
}

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const { search, sort } = req.query
    let query = `
      SELECT p.id, p.name, p.variety, p.category, p.price, p.stock_qty,
             p.photo, u.full_name as farmer_name, u.id as farmer_id,
             p.created_at, p.is_active
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.is_deleted = 0
    `
    const params = []

    if (search) {
      query += ' AND (p.name LIKE ? OR u.full_name LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    // Sorting options
    switch (sort) {
      case 'name-desc':
        query += ' ORDER BY p.name DESC'
        break
      case 'newest':
        query += ' ORDER BY p.created_at DESC'
        break
      case 'oldest':
        query += ' ORDER BY p.created_at ASC'
        break
      case 'farmer-desc':
        query += ' ORDER BY u.full_name DESC'
        break
      case 'farmer-asc':
        query += ' ORDER BY u.full_name ASC'
        break
      default:
        query += ' ORDER BY p.name ASC'
    }

    const [products] = await db.query(query, params)
    res.json(products)
  } catch (error) {
    next(error)
  }
}

// Get orders
const getOrders = async (req, res, next) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.buyer_id, o.farmer_id, o.total_amount, o.grand_total,
             o.status, o.created_at,
             b.full_name as buyer_name, f.full_name as farmer_name
      FROM orders o
      JOIN users b ON o.buyer_id = b.id
      JOIN users f ON o.farmer_id = f.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `)

    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    // Count users by role
    const [userStats] = await db.query(`
      SELECT role, COUNT(*) as count, 
             SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count
      FROM users
      WHERE role != 'admin'
      GROUP BY role
    `)

    // Count pending applications
    const [pendingStats] = await db.query(`
      SELECT role, COUNT(*) as count
      FROM users
      WHERE status = 'pending'
      GROUP BY role
    `)

    // Product statistics
    const [productStats] = await db.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN stock_qty < 10 THEN 1 ELSE 0 END) as low_stock,
        SUM(stock_qty * price) as total_inventory_value
      FROM products
      WHERE is_deleted = 0
    `)

    // Order statistics
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status IN ('pending', 'confirmed', 'preparing', 'shipped') THEN 1 ELSE 0 END) as pending_orders,
        SUM(grand_total) as total_sales
      FROM orders
    `)

    // Commission earned
    const [commissionStats] = await db.query(`
      SELECT 
        COUNT(*) as total_commissions,
        SUM(commission_amt) as admin_commission
      FROM commissions
      WHERE status = 'paid'
    `)

    res.json({
      users: userStats,
      pending: pendingStats,
      products: productStats[0],
      orders: orderStats[0],
      commission: commissionStats[0],
    })
  } catch (error) {
    next(error)
  }
}

// Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!['farmer', 'buyer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId])
    res.json({ message: 'User role updated successfully' })
  } catch (error) {
    next(error)
  }
}

// Suspend/Unsuspend user
const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    if (!['active', 'suspended', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId])
    res.json({ message: `User status updated to ${status}` })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getPendingApplications,
  verifyUser,
  getAllProducts,
  getOrders,
  getDashboardStats,
  updateUserRole,
  toggleUserStatus,
}
