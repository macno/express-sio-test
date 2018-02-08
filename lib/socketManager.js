const sm = function(socket, dispatcher) {
  socket.on('test:stop', function() {
    const status = dispatcher.stop();
    socket.emit('status', status);
  });
  socket.on('test:start', function() {
    const status = dispatcher.start();
    socket.emit('status', status);
  });
  socket.on('status:get', function() {
    const status = dispatcher.getStatus();
    socket.emit('status', status);
  });
  socket.on('status:history', function() {
    const history = dispatcher.getHistory();
    socket.emit('history', history);
  });
  socket.on('disconnect', function() {
    // ??
  });
};

module.exports = sm;
