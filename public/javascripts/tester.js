var container = $('#container');
var logger;
var stopButton;
var message;
var renderer = {
  showNotRunning: function() {
    var startButton = $('<button>START</button>');
    startButton.on('click', function() {
      socket.emit('test:start');
    });
    container
      .empty()
      .append('<p>Ready to start</p> ')
      .append(startButton);
  },
  showRunning: function() {
    stopButton = $('<button>STOP</button>');
    stopButton.on('click', function() {
      socket.emit('test:stop');
    });
    message = $('<p>Test is running</p>');
    logger = $('<div class="logger"/>');
    container
      .empty()
      .append(message)
      .append(stopButton)
      .append(logger);
  },
  showHistory: function(history) {
    for (let i = history.length - 1; i >= 0; i--) {
      const item = history[i];
      if (item.line !== '')
        logger.prepend('<span class="' + (item.type === 'err' ? 'error' : '') + '">' + item.line + '</span><br/>');
    }
  },
  showCompleted: function() {
    message.text('Test completed');
    stopButton.text('CLEAR');
  },
  appendLog: function(lines, error) {
    lines.forEach(line => {
      if (line !== '') logger.append('<span class="' + (error ? 'error' : '') + '">' + line + '</span><br/>');
    });
  }
};

var socket = io();
socket.emit('status:get');
socket.on('status', function(status) {
  console.log('current status', status);
  if (!status) {
    renderer.showNotRunning();
  } else {
    renderer.showRunning();
    socket.emit('status:history');
  }
});
socket.on('test:log', function(lines) {
  renderer.appendLog(lines);
});
socket.on('test:error', function(lines) {
  renderer.appendLog(lines, true);
});
socket.on('test:completed', function(line) {
  renderer.showCompleted();
});
socket.on('history', function(history) {
  renderer.showHistory(history);
});
