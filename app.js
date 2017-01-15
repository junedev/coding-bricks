const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// index page is also included here
app.use(express.static('./public'))

app.get('/token', function (req, res) {
  const hmac = crypto.createHmac('sha256', process.env['REPL_SECRET']);
  const created = new Date().getTime()
  hmac.update(created.toString())
  const token = hmac.digest('base64').trim()
  res.json({msg_mac: token, time_created: created})
})

app.listen(5555, function (err) {
  if (err) return console.err(err)
  console.log('Server listening on port 5555')
})
