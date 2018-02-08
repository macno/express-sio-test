const sm = function(socket, dispatcher) {
  socket.on('test:stop', function() {
    var status = dispatcher.stop();
    socket.emit('status', status);
  })
  socket.on('test:start', function() {
    var status = dispatcher.start();
    socket.emit('status', status);
  })
  socket.on('status:get', function() {
    var status = dispatcher.getStatus();
    socket.emit('status', status);
  })
  socket.on('disconnect', function() {
    // ??
  });
};

module.exports = sm;
