require('dotenv').config()
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
let rawdata = fs.readFileSync(path.resolve(__dirname, 'flags.json'));
let flags = JSON.parse(rawdata);
var cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: true,
  cors: {
    origin: '*'
  }
});


app.options('*', cors()) // include before other routes
app.use(cors())
app.use(express.json())

// API

app.get('/', (req, res) => {
  res.send({ response: 'Welcome' }).status(200)
})

app.get('/api/', (req, res) => {

  res.send({ response: 'Yes im still kicking' }).status(200)
})

app.get('/api/v1/countries', (req, res) => {
  res.json(flags).status(200)
})

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);

  socket.on("player", (player) => {
    if (player.playerID === 'Player-1') {
      io.emit("player1name", player.name)
    }

    if (player.playerID === 'Player-2') {
      io.emit("player2name", player.name)
    }
  })

  socket.on("player-country", (player) => {
    console.log(player)
    if (player.playerID === 'Player-1') {
      // console.log(player)
      io.emit("player1country", player.country)
    }
    if (player.playerID === 'Player-2') {
      io.emit("player2country", player.country)
    }
  })

  socket.on("roundText", (roundTextPackage) => {
    let roundText = roundTextPackage.roundText;
    let roundTextBoolean = roundTextPackage.roundTextBoolean;
    io.emit('roundCallText', { roundText, roundTextBoolean });
  })

  socket.on("playerScore", (score) => {
    if (score.player === 'Player-1') {
      console.log(score.scoreP1)
      io.emit("player1Score", score.scoreP1)
    }

    if (score.player === 'Player-2') {
      io.emit("player2Score", score.scoreP2)
    }
  })

  socket.on("swap-place", (swap) => {
    io.emit("swap-place", swap)
  })

  socket.on("filter-to-game", (game) => {
    io.emit('use-filter', game)
  })

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
      console.log('Re-connected')
    }
    console.log('user disconnected');
  });
})


http.listen(process.env.PORT || 3000, () => {
  console.log('server is running on ' + process.env.PORT)
});