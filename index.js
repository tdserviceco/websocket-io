const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  forceNew: true,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3000/dashboard", "https://scorehandler.netlify.app", "https://scorehandler.netlify.app/dashboard"],
  }
});
const fs = require('fs');
const path = require('path');
let rawdata = fs.readFileSync(path.resolve(__dirname, 'flags.json'));
let flags = JSON.parse(rawdata);

app.options('*', cors()) // include before other routes
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    "statusText": "Hello world"
  })
})


app.get('/api/v1/flags', (req, res) => {
  res.json(flags).status(200)
})

io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    if (reason === "ping timeout") {
      io.emit('ping timeout', 'Server crashed cause you inputed to many time... server refresh once you hit ok');
      console.log('user ping timeout... restarting');
      socket.connect();

    }
    // the disconnection was initiated by the server, you need to reconnect manually
  });

  socket.on('player-one-name', (name) => {
    console.log('name p1:', name);
    io.emit('player-one-name-answer', name)
  });

  socket.on('player-two-name', (name) => {
    console.log('name p2:', name);
    io.emit('player-two-name-answer', name)
  });

  socket.on('player-one-score', (score) => {
    console.log('score p1:', score)
    io.emit('player-one-score-answer', score)
  })

  socket.on('player-two-score', (score) => {
    console.log('score p2:', score)
    io.emit('player-two-score-answer', score)

  })

  socket.on('players-swap-side', (swap) => {
    console.log('swap:', swap)
    io.emit('players-swap-side-answer', swap)
  })

  socket.on('round-announce', (announce) => {
    console.log('announce:', announce)
    io.emit('round-announce-answer', announce)

  })

  socket.on('player-one-country-flag', (flag) => {
    console.log('flag p1:', flag)
    io.emit('player-one-country-flag-answer', flag)
  })

  socket.on('player-two-country-flag', (flag) => {
    console.log('flag p2:', flag)
    io.emit('player-two-country-flag-answer', flag)
  })

  socket.on('activate-xbox-logo', (choice) => {
    console.log('activate xbox logo:', choice)
    io.emit('activate-xbox-logo-answer', choice)
  })

  socket.on('layout-skin', (choice) => {
    console.log('layout-skin:', choice)
    io.emit('layout-skin-answer', choice)
  })
});

http.listen(process.env.PORT || port, () => { console.log(`listening on *:${process.env.PORT || port}`); });
