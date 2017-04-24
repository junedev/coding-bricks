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

app.get('/3', function (req, res) {
  const task = {
    description: 'Aufgabe 3: Du arbeitest an der App für ZARA. Für eine Rabatt-Aktion müssen die reduzierten Preise im Warenkorb berechnet werden. ' + 
      'Für den gesamten Einkaufswert soll es 10% Rabatt geben. ' +
      'Zusätzlich sollen 5 Euro abgezogen werden, wenn der reduzierte Preis über 50 Euro beträgt. ' +
      'Dein Programm bekommt den Einkaufswert als Eingabe und soll den Preis nach allen Rabatten ausgeben.',
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

app.get('/1', function (req, res) {
  const task = {
    description: 'Aufgabe 1: Euer erstes Programm soll den Nutzer begrüßen. Euer Programm bekommt einen Namen, z.B. Anna, als Eingabe ' +
    ' und soll "Hallo Anna!" ausgeben.',
    tests: [
      { input: '"Anna"', expected: 'Hallo Anna!' },
      { input: '"Sophie"', expected: 'Hallo Sophie!' },
      { input: '"Jan"', expected: 'Hallo Jan!' },
      { input: '""', expected: 'Hallo !' }
    ],
    elements: [
      {type: 'basic', text: 'Ausgabe:', code: 'puts '},
      {type: 'basic', text: 'Eingabe', code: 'input '},
      {type: 'basic', text: '+', code: '+ '},
      {type: 'basic', text: '-', code: '- '},
      {type: 'input'}
    ]
  }
  res.json(task)
})

app.post('/evaluate', function (req, res) {
  console.log(`ruby -e ${req.body.code}`)
  childProcess.exec(`ruby -e '${req.body.code}'`, function (err, output, error) {
    console.log(err, error, output)
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
