function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join:expert', (expertId) => {
      socket.join(`expert:${expertId}`);
      console.log(`📡 Socket ${socket.id} joined room expert:${expertId}`);
    });

    socket.on('leave:expert', (expertId) => {
      socket.leave(`expert:${expertId}`);
      console.log(`📡 Socket ${socket.id} left room expert:${expertId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { initSocket };
