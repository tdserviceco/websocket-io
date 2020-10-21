require('dotenv').config()
const express = require('express');
const app = express();
var cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: true
});

this.state = {
  Countries: __dirname + "/json/Countries.json",
  Players: __dirname + "/json/Players.json"
}

const { Countries, Players } = this.state;
app.options('*', cors()) // include before other routes
app.use(cors())

// API

app.get('/', (req, res) => {
  res.send({ response: 'Welcome' }).status(200)
})


app.get('/api/countries', (req, res) => {
  res.sendFile(Countries);
})

app.get('/api/', (req, res) => {
  res.send({ response: 'Yes im still kicking' }).status(200)
})

app.get('/api/players', (req, res) => {
  res.sendFile(Players);
})

app.get('/api/player/?:id&:player&:code', (req, res) => {
  res.send(req.params)
})

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);

  socket.on("player", ({ playerID, playerName, playerCountry }) => {
    if (playerID === 'Player-1') {
      io.emit("player1name", { playerName })
      io.emit("player1country", {
        country: playerCountry + ".png"
      })
    }

    if (playerID === 'Player-2') {
      io.emit("player2name", { playerName })
      io.emit("player2country", {
        country: playerCountry + ".png"
      })
    }
  })


  socket.on("playerScore", ({ player, scoreP1 ,scoreP2 }) => {

    if (player === 'Player-1') {
      io.emit("player1Score", { scoreP1 })
      console.log(scoreP1)
    }

    if (player === 'Player-2') {
      io.emit("player2Score", { scoreP2 })
      console.log(scoreP2)
    }
  })

  socket.on("swap-place", (swap) => {
    io.emit("swap-place", swap)
  })

  socket.on("last minute", (lastMinute) => {
    console.log(lastMinute)
    io.emit("last minute", lastMinute)
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
