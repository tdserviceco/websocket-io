require('dotenv').config()
let swap;
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
  console.log("result: " + req.params)
  res.send(req.params)
})

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);

  socket.on("player", ({ playerID, name, country }) => {
    if (id === 'player-1') {
      io.emit("player1name", { name })
      io.emit("player1country", {
        country: country + ".png"
      })
    }

    if (id === 'player-2') {
      io.emit("player2name", { playerID, name })
      io.emit("player2country", {
        country: country + ".png"
      })
    }
  })

  socket.on("playerScore", ({ player}) => {
    if (player === 'player-1') {
      io.emit("player1Score", { player })
    }

    if (player === 'player-2') {
      io.emit("player2Score", { player })
    }
  })

  socket.on("swap-place", ( swap ) => {
    io.emit("swap-place", swap)
    console.log(swap)
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
