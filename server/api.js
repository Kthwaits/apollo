const express = require('express');
const request = require('requestretry');

const AuthConfig = require('../config/auth');
const PlaybackActions = require('../actions/playbackActions');
const ProfileActions = require('../actions/profileActions');
const Router = express.Router;

var listeners = [];
var dj = {};

const exportedApi = (io) => {
  let api = Router();

  io.on('connection', (socket) => {
    socket.on('listener', (user) => {
      ProfileActions.getProfileInfo(user)
      .then((user) => {
        listeners.push(user);
        io.sockets.emit('updateListeners', listeners);
      });

    });

    socket.on('dj', (user) => {
      ProfileActions.getProfileInfo(user)
      .then((user) => {
        dj = user;
        io.sockets.emit('updateDj', dj);
      });
    });

    socket.on('sync', () => {
      console.log('sync');
      PlaybackActions.sync(dj, listeners);
    });
  });
  return api;
};

module.exports = exportedApi;
