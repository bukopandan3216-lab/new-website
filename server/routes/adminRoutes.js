const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const {
  getAllUsers,
  getPendingApplications,
  verifyUser,
  getAllProducts,
  getOrders,
  getDashboardStats,
  updateUserRole,
  toggleUserStatus,
} = require('../controllers/adminController')

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware)

// User management
router.get('/users', getAllUsers)
router.get('/users/pending', getPendingApplications)
router.put('/users/:userId/verify', verifyUser)
router.put('/users/:userId/role', updateUserRole)
router.put('/users/:userId/status', toggleUserStatus)

// Product management
router.get('/products', getAllProducts)

// Order management
router.get('/orders', getOrders)

// Dashboard
router.get('/dashboard/stats', getDashboardStats)

module.exports = router
