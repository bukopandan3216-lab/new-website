const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  //host: process.env.DB_HOST,
 // port: process.env.DB_PORT,
 // user: process.env.DB_USER,
 // password: process.env.DB_PASSWORD,
  //database: process.env.DB_NAME,
  

DB_HOST= mysql.railway.internal,
DB_PORT=3306,
DB_USER=root,
DB_PASSWORD=your_password,
DB_NAME=railway,
MYSQL_DATABASE=railway,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool
