const httpHandler = require('./httpHandler');
const ioHandler = require('./ioHandler');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

// Create HTTP server. Handles HTTP requests.
const server = httpHandler.CreateServer(PORT);

// Set IO Handler to listen to the server.
ioHandler.CreateIO(server, (socket) => {
  // This userID is used to differentiate shapes from different clients.
  const userID = `user${(Math.floor((Math.random() * 100000)) + 1)}`;

  // Handles when a message is received from a socket.
  socket.on('transformShape', (newShape) => {
    const shape = newShape;

    // Send shape back to sender.
    shape.color = 'green';
    socket.emit('transformShape', { userID, shape }); // Send red shapes to everyone excepts the sender.

    // Send shape to others
    shape.color = 'red';
    socket.broadcast.emit('transformShape', { userID, shape }); // Send red shapes to everyone excepts the sender.

    // Send confirmation message.
    socket.emit('serverMessage', { message: 'Shape Updated' });  // Sends confirmation message to server.
  });
});
