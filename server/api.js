const express = require('express');
const request = require('requestretry');

const AuthConfig = require('../config/auth');
const PlaybackActions = require('../actions/playbackActions');
const Router = express.Router;

var listeners = [];
var dj = {};

const exportedApi = (io) => {
  let api = Router();

  io.on('connection', (socket) => {
    socket.on('listener', (user) => {
      listeners.push(user);
    });

    socket.on('dj', (user) => {
      dj = user;
    });

    socket.on('sync', () => {
      var syncLoop = setInterval(() => {
        console.log('sync');
        PlaybackActions.sync(dj, listeners);
      }, 5000);
    });
  });
  return api;
};

module.exports = exportedApi;
