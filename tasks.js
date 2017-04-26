module.exports = [
  {
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
  },
  {
    description: 'Aufgabe 2: Du arbeitest an der App für ZARA. In der aktuellen Rabattaktion gibt es 20% Rabatt für alle Einkäufe. ' +
      'Dein Programm erhält den Preis des Einkaufs als Eingabe und soll den reduzierten Preis ausgeben.',
    tests: [
      { input: 10, expected: 8 },
      { input: 20, expected: 16 },
      { input: 100, expected: 80 }
    ],
    elements: [
      {type: 'basic', text: 'Ausgabe:', code: 'puts '},
      {type: 'basic', text: 'Eingabe', code: 'input '},
      {type: 'input'},
      {type: 'basic', text: '+', code: '+ '},
      {type: 'basic', text: '-', code: '- '},
      {type: 'basic', text: '*', code: '* '},
      {type: 'basic', text: '/', code: '/ '},
      {type: 'basic', text: '(', code: '( '},
      {type: 'basic', text: ')', code: ')'}
    ]
  },
  {
    description: 'Aufgabe 3: Du arbeitest weiter an der ZARA App. ' +
      'Für eine neue Rabattaktion soll es auf dem gesamten Einkaufswert 10% Rabatt geben. ' +
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
      {type: 'assignment'},
      {type: 'input'},
      {type: 'conditional'},
      {type: 'basic', text: '+', code: '+ '},
      {type: 'basic', text: '-', code: '- '},
      {type: 'basic', text: '*', code: '* '},
      {type: 'basic', text: '/', code: '/ '},
      {type: 'basic', text: '(', code: '( '},
      {type: 'basic', text: ')', code: ')'},
      {type: 'basic', text: '<', code: '< '},
      {type: 'basic', text: '>', code: '> '},
      {type: 'basic', text: '=', code: '== '}
    ]
  },
  {
    description: 'Aufgabe 4: Du baust einen (nicht besonders hilfreichen) Chat-Bot. Er bekommt eine Nachricht als Eingabe und soll eine Antwort ausgeben. ' +
      'Auf jede Frage antwortet der Bot mit "Was weiß ich.", auf jede Aufforderung mit "Chill mal.". Bei allen anderen Nachrichten antwortet er mit "Mir doch egal."',
    tests: [
      { input: '"Wie wird das Wetter morgen?"', expected: 'Was weiß ich.' },
      { input: '"Bist du lebendig?"', expected: 'Was weiß ich.' },
      { input: '"Kauf eine Karte fürs Kino!"', expected: 'Chill mal.' },
      { input: '"Heute scheint die Sonne."', expected: 'Mir doch egal.' },
      { input: '"Übung macht den Meister"', expected: 'Mir doch egal.' }
    ],
    elements: [
      {type: 'basic', text: 'Ausgabe:', code: 'puts '},
      {type: 'basic', text: 'Eingabe', code: 'input '},
      {type: 'input'},
      {type: 'assignment'},
      {type: 'conditional'},
      {type: 'ends'},
      {type: 'basic', text: '+', code: '+ '},
      {type: 'basic', text: '<', code: '< '},
      {type: 'basic', text: '>', code: '> '}
    ]
  }
]
