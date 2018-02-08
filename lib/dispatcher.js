const { spawn } = require('child_process');

const dispatcher = function(io) {
  let running = false;
  let child;
  let history = [];
  const executeTest = function() {
    running = true;
    history = [];
    child = spawn('ping', ['-c', '20', '8.8.8.8']);
    child.on('exit', function(code, signal) {
      running = false;
      io.emit('test:completed');
    });
    child.stdout.on('data', data => {
      const lines = data.toString().split('\n');
      io.emit('test:log', lines);
      lines.forEach(line => {
        history.push({ line, type: 'out' });
      });
    });
    child.stderr.on('data', data => {
      const lines = data.toString().split('\n');
      io.emit('test:error', lines);
      lines.forEach(line => {
        history.push({ line, type: 'err' });
      });
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
    },
    getHistory: function() {
      return history;
    }
  };
};

module.exports = dispatcher;
