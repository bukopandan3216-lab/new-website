const express = require('express')
const { createOrder, myOrders } = require('../controllers/orderController')

const router = express.Router()

router.post('/create', createOrder)
router.get('/my-orders/:userId', myOrders)

module.exports = router
