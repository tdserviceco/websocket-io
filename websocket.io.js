require('dotenv').config()

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: true
});
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.MONGODB;
const dbName = 'xboxfighters';
// Use connect method to connect to the Server


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
    socket.send('client', { value: 'Hi Client!' })
  })

})

app.use(express.static('public'))

// API

app.get('/api/countries', (req, res) => {
  var url = process.env.MONGODB;
  const client = new MongoClient(url, { useUnifiedTopology: true }); // { useUnifiedTopology: true } removes connection warnings;
  const dbName = "xboxfighters";
  client
    .connect()
    .then(
      client =>
        client
          .db(dbName).
          collection("Countries").find({})
          .toArray() // Returns a promise that will resolve to the list of the collections
    )
    .then(cols => res.json(cols))
    .finally(() => client.close());
});

app.get('/api/players', (req, res) => {
  console.log('OH BOY!!!');
})

app.get('/api/players', (req, res) => {
  var url= "mongodb+srv://xboxfighters:xboxfighters2020@cluster0.vmbtm.mongodb.net/xboxfighters";
  
  const client = new MongoClient(url, { useUnifiedTopology: true }); // { useUnifiedTopology: true } removes connection warnings;
  const dbName = "xboxfighters";
  client
    .connect()
    .then(
      client =>
        client
          .db(dbName).
          collection("Players").find({})
          .toArray() // Returns a promise that will resolve to the list of the collections
    )
    .then(cols => res.json(cols))
    .finally(() => client.close());
});


app.post('/api/players', (req, res) => {

})

http.listen(process.env.PORT || 3000, () => {
  console.log('server is running on ' + process.env.PORT)
});