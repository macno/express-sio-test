const { spawn } = require('child_process');

const dispatcher = function(io) {
  var running = false;
  var child;
  var executeTest = function() {
    running = true;
    child = spawn('ping', ['-c', '20', '8.8.8.8']);
    child.on('exit', function(code, signal) {
      running = false;
      io.emit('test:completed');
    });
    child.stdout.on('data', data => {
      io.emit('test:log', data.toString().split('\n'));
    });
    child.stderr.on('data', data => {
      io.emit('test:error', data);
    });
  };
  return {
    getStatus: function() {
      return running;
    },
    start: function() {
      executeTest();
      return running;
    },
    stop: function() {
      // TODO kill process
      return running;
    }
  };
};

module.exports = dispatcher;
