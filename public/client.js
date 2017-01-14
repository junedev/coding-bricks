$(function () {

  var repl;
  $.get(window.location.origin + '/token', function(token) {
    repl = new ReplitClient("api.repl.it", 80, "ruby", token);
  });

  $(".brick").draggable({
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    zIndex: 10000,
    appendTo: "body",
    cursor: "move"
  });

  var dropArea = $("#drop-area");
  dropArea.droppable({
    accept: ".brick",
    drop: function (event, ui) {
      var copy = ui.draggable.clone();
      dropArea.append(copy);
      writeCode(copy.data("codeStart"));
    }
  });

  $("#run").on('click', function (e) {
    e.preventDefault();
    runCode($("#program").text());
  })

  function writeCode(code) {
    $("#program").html(code);
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

});