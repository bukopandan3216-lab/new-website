const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'https://thefarmerww.vercel.app',
  credentials: true
}))
//app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('API Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
