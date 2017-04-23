const express = require('express')
const crypto = require('crypto')
const childProcess = require('child_process')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// index page is also included here
app.use(express.static('./public'))

app.get('/token', function (req, res) {
  const hmac = crypto.createHmac('sha256', process.env['REPL_SECRET'])
  const created = new Date().getTime()
  hmac.update(created.toString())
  const token = hmac.digest('base64').trim()
  res.json({msg_mac: token, time_created: created})
})

app.get('/1', function (req, res) {
  const task = {
    description: 'Du programmierst die App für ZARA. Für die nächste Rabattaktion soll es auf alle Produkte 10% Rabatt geben. ' +
      'Zusätzlich gibt es 5 Euro Abzug, wenn der reduzierte Preis über 50 Euro beträgt. ' +
      'Dein Programm bekommt den Originalpreis als Eingabe und soll den reduzierten Preis ausgeben.',
    tests: [
      { input: 10, expected: 9 },
      { input: 20, expected: 18 },
      { input: 100, expected: 85 },
      { input: 50, expected: 45 }
    ],
    elements: [
      {type: 'basic', text: 'Ausgabe:', code: 'puts '},
      {type: 'basic', text: 'Eingabe', code: 'input '},
      {type: 'basic', text: '+', code: '+ '},
      {type: 'basic', text: '-', code: '- '},
      {type: 'basic', text: '*', code: '* '},
      {type: 'basic', text: '/', code: '/ '},
      {type: 'basic', text: '<', code: '< '},
      {type: 'basic', text: '>', code: '> '},
      {type: 'assignment'},
      {type: 'input'},
      {type: 'conditional'}
    ]
  }
  res.json(task)
})

app.get('/2', function (req, res) {
  const task = {
    description: 'Aufgabe2',
    tests: [
      { input: 10, expected: 9 }
    ],
    elements: [
      {type: 'basic', text: 'Ausgabe:', code: 'puts '}
    ]
  }
  res.json(task)
})

app.post('/evaluate', function (req, res) {
  console.log(`ruby -e ${req.body.code}`)
  childProcess.exec(`ruby -e '${req.body.code}'`, function (err, output, error) {
    if (err) {
      error = err
    }
    res.json({output: output.slice(0, -1), error})
  })
})

app.listen(5555, function (err) {
  if (err) return console.err(err)
  console.log('Server listening on port 5555')
})
