// Main Game Server
const express = require('express');
const io = require('socket.io')(3000);
var path = require('path');

let scores = {};


const app = express();
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/static", express.static("static"));
app.set("views", path.join(__dirname, "/views"));

app.get('/servidor', (req, res) => {

    console.log("inicio servidor");
    
    var _msg = { trilha: "", origem: "", mensagem: "AQUI!" };
    res.render('login', { msg: _msg });
});
app.listen(80, function () {
    console.log('Server started on port 80');
});


io.on('connection', (socket) => {
  console.log('Main game connected');

  // Transmit questions to clients
  socket.on('question', (question) => {
    io.emit('question', question);
  });

  // Receive answers from clients
  socket.on('answer', (data) => {
    const { clientId, answer } = data;
    // Update scores based on correct or incorrect answers
    // ...

    // Transmit updated scores to all clients
    io.emit('updateScores', scores);
  });
});