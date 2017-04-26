$(function () {
  // var repl
  // $.get(window.location.origin + '/token', function (token) {
  //   repl = new ReplitClient('api.repl.it', 80, 'ruby', token)
  // })

  var numberOfTests = 0

  var dropOptions = {
    accept: '.brick',
    greedy: true,
    drop: function (event, ui) {
      var copy = ui.draggable.clone()
      $(event.target).append(copy)
      event.stopPropagation()
      writeCode()
      $("input[type='text']").on('input', function () {
        var value = $(this).val()
        var hasAssignment = !!$('.var-name').toArray().find(function(e){
          return $(e).val() === value
        })
        if(isNaN(value) && !hasAssignment) value = '"' + value + '"'
        $(this).attr('data-code', value + ' ')
        writeCode()
      })
      $('.drop-area').droppable(dropOptions)
      $('.glyphicon-trash').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        $(e.currentTarget).parent().remove()
        writeCode()
      })
    }
  }

  $('.drop-area').droppable(dropOptions)

  function writeCode () {
    $('#program').text('')
    $('#playground').children().each(write)
    const program = $('#program').html().replace(/(<br>)*$/, '').replace(/\s\.end_with/g, '.end_with').replace(/\s\.start_with/g, '.start_with').replace(/_with\?\s"(.*?)"/g, '_with?\("$1"\)')
    $('#program').text('')
    console.log(program)
    $('#program').append(program)
  }

  function write (i, e) {
    if ($(e).attr('data-code')) {
      $('#program').append($(e).attr('data-code'))
    }
    if ($(e).children().length) {
      $(e).children().each(write)
    }
  }

  var correct = '<span class="glyphicon glyphicon-ok pull-right correct"></span>'
  var wrong = '<span class="glyphicon glyphicon-remove pull-right"></span>'

  function runCode (code, node) {
    $.ajax({
      url: '/evaluate',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({code: code})
    })
      .done(function (data) {
        console.log(data)
        addResult(data.output || data.error, node)
      })
  }

  // function runCode (code, node) {
  //   code = decode(code)
  //   repl.evaluateOnce(
  //     code,
  //     {
  //       stdout: function (output) {
  //         if (!output.trim()) return
  //         addResult(output, node)
  //       }
  //     }).then(
  //     function success (result) {
  //       if (result.error) {
  //         console.log('Error:', result.error)
  //       } else {
  //         console.log('Result', result.data)
  //       }
  //     },
  //     function error (error) {
  //       console.error('Error connecting to repl.it')
  //     })
  // }

  function addResult (output, node) {
    $('.start').blur()
    if (output && typeof output !== 'string') output = 'Fehler'
    if (output) output.replace(/\n/g, '<br>')
    let expected = node.attr('data-expected')
    node.html('Ausgabe: ')
    if(output.startsWith('Fehler')) output = '<span class="red">' + output + '</span>'
    node.append(output)
    if (!isNaN(expected)) expected = parseFloat(expected)
    if (!isNaN(output)) output = parseFloat(output)
    if (expected == output) {
      node.append(correct)
    } else {
      node.append(wrong)
    }
    if ($('.correct').length === numberOfTests) {
      $('#nextTask').modal()
    }
  }

  var dragOptions = {
    revert: 'invalid', // when not dropped, the item will revert back to its initial position
    containment: 'document',
    helper: 'clone',
    zIndex: 10000,
    appendTo: 'body',
    cursor: 'move'
  }

  function showTask (task) {
    $('#task').text(task.description)
    task.elements.forEach(function (e) {
      var node
      if (e.type === 'basic') {
        node = $('#basicNode').clone()
        node.attr('id', '')
        node.attr('data-code', e.code)
        node.prepend(e.text)
      }
      if (e.type === 'input') {
        node = $('#inputNode').clone()
        node.attr('id', '')
      }
      if (e.type === 'ends') {
        node = $('#ends').clone()
        node.attr('id', '')
      }
      if (e.type === 'conditional') {
        node = $('#conditional').clone()
        node.attr('id', '')
      }
      if (e.type === 'assignment') {
        node = $('#assignment').clone()
        node.attr('id', '')
      // use input value as name for variable
      }
      node.draggable(dragOptions)
      $('#bricks-list').append(node)
    })
    task.tests.forEach(function (e) {
      node = $('#testNode').clone()
      node.attr('id', '')
      node.addClass('test')
      var input = typeof e.input === 'string' ? e.input.replace(/"/g, '') : e.input
      $(node.find('p span.text')[0]).text('Eingabe: ' + input).attr('data-input', e.input)
      $(node.find('p.out')).text('Ausgabe: ').attr('data-expected', e.expected)
      $('#tests').append(node)
    })

    $('#tests').append('<button type="button" class="btn btn-primary btn-large pull-right start"><span class="glyphicon glyphicon-play"></span></button>')
  }

  function decode (encodedString) {
    var textArea = document.createElement('textarea')
    textArea.innerHTML = encodedString
    return textArea.value
  }

  var taskNumber = localStorage.getItem('taskNumber')
  if (!taskNumber) {
    localStorage.setItem('taskNumber', 1)
    taskNumber = 1
  }

  $.get('/' + taskNumber)
    .done(function (task) {
      showTask(task)
      $('.start').on('click', function (e) {
        var tests = $('.test')
        numberOfTests = tests.length
        tests.each(function (test) {
          var input = $(this).find('.text').attr('data-input')
          var resultNode = $(this).find('.out')
          e.preventDefault()
          var code = 'input = ' + input + ';' + $('#program').html().replace(/<br>/g, '; ')
          code = decode(code.replace(/\n*$/g, '').replace(/;\s/g, ''))
          runCode(code, resultNode)
        })
      })
    })

})

  function showNextTask() {
    var currentTaskNumber = localStorage.getItem('taskNumber')
    localStorage.setItem('taskNumber', Number(currentTaskNumber) + 1)
    location.reload()
  }
