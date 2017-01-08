const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// index page is also included here
app.use(express.static('./public'))

app.listen(5555, function (err) {
  if (err) return console.err(err)
  console.log('Server listening on port 5555')
})
