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
    if (player.playerID === 'Player-1') {
      io.emit("player1name", player.name)
    }

    if (player.playerID === 'Player-2') {
      io.emit("player2name", player.name)
    }
  })

  socket.on("player-country", (player) => {

    if (player.playerID === 'Player-1') {
      if (player.country === 'Player-1') {
        io.emit("player1country", 'Player-1')
      }
      else {
        getCountryFlag(player.country).then(res => {
          io.emit("player1country", res.data.flag)
        }).catch(err => console.error(err));
      }
    }

    if (player.playerID === 'Player-2') {
      if (player.country === 'Player-2') {
        io.emit("player2country", 'Player-2')
      }
      else {
        getCountryFlag(player.country).then(res => {
          io.emit("player2country", res.data.flag)
        }).catch(err => console.error(err));
      }
    }
  })

  socket.on("roundText", (roundTextPackage) => {
    let roundText = roundTextPackage.roundText;
    let roundTextBoolean = roundTextPackage.roundTextBoolean;
    io.emit('roundCallText', {roundText, roundTextBoolean});
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


getCountryFlag = async (countryCode) => {
  const url = await axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
  return url;
}