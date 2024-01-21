const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const MAX_PLAYERS = 3;
let playerCount = 0;

// Initial car positions
let carPositions = {
  1: 0,
  2: 0,
  3: 0
};


// Serve the HTML file
app.use('/', express.static(path.join(__dirname, 'static')));

wss.on('connection', (socket) => {
  if (playerCount < MAX_PLAYERS) {
    playerCount++;
    const playerId = playerCount;

    // Send initial game state to the new player
    socket.send(JSON.stringify({ type: 'init', playerId, carPositions }));

    // Broadcast to all players that a new player has joined
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'playerJoined', playerId }));
      }
    });

    // Listen for player answers
    socket.on('message', (message) => {
      const data = JSON.parse(message);
      const correctAnswer = data.correct;
      console.log("correctAnswer", playerId, correctAnswer)

      if (correctAnswer) {
        // Update car position for the player who answered correctly
        carPositions[playerId] += 150;

        // Broadcast updated car positions to all players
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'updateCarPositions', carPositions }));
          }
        });
      }
      if (correctAnswer == "fim") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            let msg="fim";
            client.send(JSON.stringify({ type: 'updateGameState', msg }));
          }
        });
      }

      // Handle other game state updates based on answers
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateGameState', /* updated game state */ }));
        }
      });
    });

    // Handle player disconnection
    socket.on('close', () => {
      playerCount--;

      // Remove the disconnected player's car position
      delete carPositions[playerId];

      // Broadcast updated car positions to all players
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateCarPositions', carPositions }));
          client.send(JSON.stringify({ type: 'playerLeft', playerId }));
        }
      });
    });
  } else {
    // Reject connection if max players reached
    socket.close();
  }
});

function heartbeat() {
  console.log("heartbeat")
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}

const PORT = 80;
server.listen(PORT, () => {
  console.log(`Rodando na porta: ${PORT}`);
});
