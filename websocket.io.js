
const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: true
});

http.listen(process.env.PORT || 3000, () => {
  console.log('server is running')
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    console.log('user disconnected');
  });
})