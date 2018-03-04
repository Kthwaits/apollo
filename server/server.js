const path = require('path');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const request = require('requestretry');
const cookieParser = require('cookie-parser');

const publicPath = path.join(__dirname, '../public');

const auth = require('./auth');
const api = require('./api');

app.use(express.static(publicPath))
   .use(cookieParser())
   .use('/auth', auth)
   .use('/api', api(io));


server.listen(process.env.PORT || 3000, err => {
  if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
});
