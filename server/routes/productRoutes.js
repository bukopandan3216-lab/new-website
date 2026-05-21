const express = require('express')
const { getProducts, getProduct, createProduct } = require('../controllers/productController')
const upload = require('../config/multer')

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/create', upload.single('image'), createProduct)

module.exports = router
