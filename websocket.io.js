require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();
var cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: true
});


app.options('*', cors()) // include before other routes
app.use(cors())

// API

app.get('/', (req, res) => {
  res.send({ response: 'Welcome' }).status(200)
})

app.get('/api/', (req, res) => {
  res.send({ response: 'Yes im still kicking' }).status(200)
})

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);

  socket.on("player", (player) => {
    console.log(player)
    if (player.playerID === 'Player-1') {
      io.emit("player1name", player.name)
    }

    if (player.playerID === 'Player-2') {
      io.emit("player2name", player.name)
    }
  })

  socket.on("player-country", (player) => {
    
    if (player.playerID === 'Player-1') {

      getCountryFlag(player.country).then(res => {
        io.emit("player1country", res.data.flag)
      }).catch(err => console.error(err));

    }
    if (player.playerID === 'Player-2') {
      getCountryFlag(player.country).then(res => {
        io.emit("player2country", res.data.flag)
      }).catch(err => console.error(err));

    }
  })

  socket.on("roundText", (roundTextPackage) => {
    console.log(roundTextPackage)
    io.emit('roundCallText', roundTextPackage);
  })

  socket.on("playerScore", ({ player, scoreP1, scoreP2 }) => {
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


getCountryFlag = async (countryCode) => {
  const url = await axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
  return url;
}