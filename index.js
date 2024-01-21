const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the HTML file
app.use('/', express.static(path.join(__dirname, 'static')));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Message handling
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    const receivedMessage = message.toString('utf-8');
    console.log(receivedMessage)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
