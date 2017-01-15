$(function () {

  var repl;
  $.get(window.location.origin + '/token', function (token) {
    repl = new ReplitClient("api.repl.it", 80, "ruby", token);
  });

  var dropArea = $("#playground");
  dropArea.droppable({
    accept: ".brick",
    drop: function (event, ui) {
      var copy = ui.draggable.clone();
      dropArea.append(copy);
      writeCode();
    }
  });

  $("#run").on('click', function (e) {
    e.preventDefault();
    runCode($("#program").text());
  })

  function writeCode() {
    $('#program').text("");
    $("#playground").children().each(function() {
      $('#program').append($(this).data("codeStart"));
    });
  }

  function runCode(code) {
    repl.evaluateOnce(
      code, {
        stdout: function (output) {
          $("#run").blur();
          output.replace(/\n/g, "<br>")
          $("#result").append(output);
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
    appendTo: "body",
    cursor: "move"
  };

  var templateNode = $.parseHTML('<div class="panel panel-default brick"><div class="panel-body"></div></div>');
  function showTask(task) {
    $('#task').text(task.description);
    task.elements.forEach(function (e) {
      var node = $(templateNode).clone();
      node.attr("data-code-start", e.codeStart);
      node.children().first().text(e.text);
      node.draggable(dragOptions);
      $('#bricks').append(node);
    });
  }

  // Aufgabe 1, Discount
  var task1 = {
    description: "Du programmierst die Kassen von ZARA. Für die nächste Rabattaktion soll es auf alle Produkte 10% Rabatt geben. "
    + "Zusätzlich gibt es 5 Euro Abzug, wenn der reduzierte Preis über 50 Euro beträgt. "
    + "Dein Programm bekommt den Originalpreis als Eingabe und soll den reduzierten Preis ausgeben.",
    elements: [
      {
        text: "+",
        codeStart: "+"
      },
      {
        text: "1",
        codeStart: "1"
      },
      {
        text: "Ausgabe:",
        codeStart: "puts "
      }
    ]
  }

  showTask(task1);
});