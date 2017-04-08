$(function () {

  var repl;
  $.get(window.location.origin + '/token', function (token) {
    repl = new ReplitClient("api.repl.it", 80, "ruby", token);
  });

  var dropOptions = {
    accept: ".brick",
    greedy: true,
    drop: function (event, ui) {
      var copy = ui.draggable.clone();
      $(event.target).append(copy);
      event.stopPropagation();
      writeCode();
      $("input[type='text']").on("input", function() {
        $(this).attr("data-code", $(this).val() + " ");
        writeCode();
      });
      $(".drop-area").droppable(dropOptions);
    }
  }

  $(".drop-area").droppable(dropOptions);

  function writeCode() {
    $('#program').text("");
    $("#playground").children().each(write);
  }

  function write(i, e) {
    if($(e).attr("data-code")) {
      $('#program').append($(e).attr("data-code"));
    }
    if($(e).children().length > 0) {
      $(e).children().each(write)
    }
  }

  var correct = '<span class="glyphicon glyphicon-ok pull-right"></span>'
  var wrong = '<span class="glyphicon glyphicon-remove pull-right"></span>'

  function runCode(code, node) {
    code = decode(code)
    repl.evaluateOnce(
      code,
      {
        stdout: function (output) {
          if (!output.trim()) return
          $(".start").blur();
          output.replace(/\n/g, "<br>");
          const expected = node.attr('data-expected');
          node.html('Ergebis: ')
          node.append(output);
          if(expected == output) {
            node.append(correct)
          } else {
            node.append(wrong)
          }
        }
      }).then(
      function success(result) {
        if (result.error) {
          console.log('Error:', result.error);
        } else {
          console.log('Result', result.data);
        }
      },
      function error(error) {
        console.error('Error connecting to repl.it');
      });
  }

  var dragOptions = {
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    zIndex: 10000,
    appendTo: "parent",
    cursor: "move"
  };

  var testNode = $.parseHTML('<div class="panel panel-default"><div class="panel-body"><p><span class="text"></span><button type="button" class="btn btn-primary btn-sm pull-right start"><span class="glyphicon glyphicon-play"></span></button></p><p></p></div></div>');
  
  var basicNode = $.parseHTML('<div class="panel panel-default brick small-brick"><div class="panel-body"></div></div>');
  var inputNode = $.parseHTML('<div class="panel panel-default brick"><div class="panel-body"><div class="input-group"><input type="text" class="form-control number" placeholder="123"></div></div></div>')
  var assignment = $.parseHTML('<div class="panel panel-default brick"><div class="panel-body">Speichern als <div class="input-group"><input type="text" class="form-control number" placeholder="abc">:</div></div></div>')
  var conditional = $.parseHTML('<div class="panel panel-default brick large"><div class="panel-body"><div class="well-wrapper"><div class="well-label" data-code="if ">wenn</div>' +
  '<div class="well drop-area inline"></div></div><div class="well-wrapper"><div class="well-label" data-code="<br>">dann</div> <div class="invisible" data-code="  "></div><div class="well drop-area inline"></div>' +
  '<div class="invisible" data-code="<br>end"></div></div><div class="invisible" data-code="<br>"></div></div></div>')

  function showTask(task) {
    $('#task').text(task.description);
    task.elements.forEach(function (e) {
      var node
      if(e.type === 'basic') {
        node = $(basicNode).clone();
        node.attr("data-code", e.code);
        node.children().first().text(e.text);
      }
      if(e.type === 'input') {
        node = $(inputNode).clone();
      }
      if(e.type === 'conditional') {
        node = $(conditional).clone();
      }
      if(e.type === 'assignment') {
        node = $(assignment).clone();
        // use input value as name for variable
      }
      node.draggable(dragOptions);
      $('#bricks').append(node);
    });
    task.tests.forEach(function (e) {
      node = $(testNode).clone();
      $(node.find('p span.text')[0]).text('Eingabe: ' + e.input).attr("data-input", e.input);
      $(node.find('p')[1]).text('Ergebnis: ').attr("data-expected", e.expected);
      $('#tests').append(node);
    })
  }

  function decode(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  // Aufgabe 1, Discount
  var task1 = {
    description: "Du programmierst die App für ZARA. Für die nächste Rabattaktion soll es auf alle Produkte 10% Rabatt geben. "
    + "Zusätzlich gibt es 5 Euro Abzug, wenn der reduzierte Preis über 50 Euro beträgt. "
    + "Dein Programm bekommt den Originalpreis als Eingabe und soll den reduzierten Preis ausgeben.",
    tests: [
      { input: 10, expected: 9 },
      { input: 50, expected: 45 },
      { input: 100, expected: 85 }
    ],
    elements: [
      {
        type: "basic",
        text: "Ausgabe:",
        code: "puts "
      },
      {
        type: "basic",
        text: "Eingabe",
        code: "input "
      },
      {
        type: "input"
      },
      { 
        type: "basic",
        text: "+",
        code: "+ "
      },
      {
        type: "basic",
        text: "-",
        code: "- "
      },
      {
        type: "basic",
        text: "*",
        code: "* "
      },
      {
        type: "basic",
        text: "/",
        code: "/ "
      },
      {
        type: "basic",
        text: "<",
        code: "< "
      },
      {
        type: "basic",
        text: ">",
        code: "> "
      },
      {
        type: "conditional"
      },
      {
        type: "assignment"
      }
    ]
  }

  showTask(task1);

  $(".start").on('click', function (e) {
    var input = $(e.currentTarget).prev().attr('data-input')
    var resultNode = $(e.currentTarget).parent().next()
    console.log(input)
    e.preventDefault();
    var code = 'input = ' + input + '\n' + $("#program").html().replace(/<br>/g, '\n')
    console.log(code)
    runCode(code, resultNode);
  })

});