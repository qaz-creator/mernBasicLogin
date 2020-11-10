const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use('/api', require('./routes/index'))

// mongoose
mongoose.connect(MONGOURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
mongoose.connection.on('connected', () => {
  console.log('Connected to mongoDB')
})
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to mongoDB', err)
})

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
