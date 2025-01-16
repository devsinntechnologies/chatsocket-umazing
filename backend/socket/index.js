const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const messageHandlers = require('./messageHandlers');
const roomHandlers = require('./roomHandlers');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*', // Update with your frontend URL for production
      methods: ['GET', 'POST'],
    },
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.error('Authentication error: No token provided');
      return next(new Error('Authentication error'));
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, 'umazing-key_jwt_secret_key'); // Replace with your secret key
      socket.user = decoded; // Attach decoded user info to socket
      console.log(`User authenticated: ${socket.user.id}`);
      next();
    } catch (err) {
      console.error('Authentication error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.user.id}`);
    
    // Load modularized event handlers
    messageHandlers(io, socket);
    roomHandlers(io, socket);

    // Add more handlers if needed
  });

  return io; // Return the io instance for potential further use
};
