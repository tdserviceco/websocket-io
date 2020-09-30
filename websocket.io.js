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

const { Countries,Players } = this.state;

app.use(cors(), express.static('public'))

// API

app.get('/', (req,res) => {
  res.send({response: 'Welcome'}).status(200)
})

app.get('/api/countries', (req, res) => {
  res.sendFile(Countries);
})

app.get('/api/', (req, res) => {
  res.send({response: 'Yes im still kicking'}).status(200)
})

app.get('/api/players', (req, res) => {
  res.sendFile(Players);
})

app.get('/api/player/?:id&:player&:code', (req, res) => {
  console.log("result: " + req.params)
  res.send(req.params)
})

io.on('connection', (socket) => {
  console.log('Connected')
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
      console.log('Re-connected')
    }
    console.log('user disconnected');
  });
  socket.on('server', (data) => {
    console.log(data)
    socket.emit('player', data)
  })

})


http.listen(process.env.PORT || 3000, () => {
  console.log('server is running on ' + process.env.PORT)
});