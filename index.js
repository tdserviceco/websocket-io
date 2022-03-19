const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const io = new Server(http, {
  cors: {
    origin: '*'
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});
const fs = require('fs');
const path = require('path');
let rawdata = fs.readFileSync(path.resolve(__dirname, 'flags.json'));
let flags = JSON.parse(rawdata);


app.options('*', cors()) // include before other routes
app.use(cors())
app.use(express.json())

app.get('/api/', (req, res) => {
  res.send({ response: 'Yes im still kicking' }).status(200)
})

app.get('/api/v1/flags', (req, res) => {
  res.json(flags).status(200)
})

io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
      console.log('Re-connected')
    }
    console.log('user disconnected');
  });

  socket.on('player-one-name', (name) => {
    console.log('name p1:', name);
    io.emit('player-one-name', name)
  });

  socket.on('player-two-name', (name) => {
    console.log('name p2:', name);
    io.emit('player-two-name', name)
  });

  socket.on('player-one-score', (score) => {
    console.log('score p1:', score)
    io.emit('player-one-score', score)
  })

  socket.on('player-two-score', (score) => {
    console.log('score p2:', score)
    io.emit('player-two-score', score)

  })

  socket.on('players-swap-side', (swap) => {
    console.log('swap:', swap)
    io.emit('players-swap-side', swap)
  })

  socket.on('round-announce', (announce) => {
    console.log('announce:', announce)
    io.emit('round-announce', announce)

  })

  socket.on('player-one-country-flag', (flag) => {
    console.log('flag p1:', flag)
    io.emit('player-one-country-flag', flag)
  })

  socket.on('player-two-country-flag', (flag) => {
    console.log('flag p2:', flag)
    io.emit('player-two-country-flag', flag)
  })

  socket.on('activate-xbox-logo', (choice) => {
    console.log('activate xbox logo:', choice)
    io.emit('activate-xbox-logo', choice)
  })


});

http.listen(5100, () => { console.log('listening on *:5100'); });