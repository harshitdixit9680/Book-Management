const connectToMongo = require("./db")
const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose");
connectToMongo();


const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
// Avaible Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/book', require('./routes/book'));


app.listen(port, () => {
  console.log(`Shree-Shyam-Restaurant backend  listening on port ${port}`)
})


