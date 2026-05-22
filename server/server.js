const express = require('express')
const cors = require('cors')
const pool = require('./db') // ✅ IMPORTANT FIX

const app = express()

app.use(cors({
  origin: 'https://thefarmerww.vercel.app',
  credentials: true
}))

app.use(express.json()) // ✅ ENABLE THIS

app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('API Running')
})

const PORT = process.env.PORT || 5000

// ✅ TEST DB ROUTE
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')

    res.json({
      success: true,
      data: rows
    })
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
