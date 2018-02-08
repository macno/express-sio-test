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
  showCompleted: function() {
    message.text('Test completed');
    stopButton.text('CLEAR');
  },
  appendLog: function(lines, error) {
    lines.forEach(line => {
      logger.append('<p class="' + (error ? 'error' : '') + '">' + line + '</p>');
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
