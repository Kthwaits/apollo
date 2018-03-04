const express = require('express');
const request = require('requestretry');

const AuthConfig = require('../config/auth');
const PlaybackActions = require('../actions/playbackActions');
const ProfileActions = require('../actions/profileActions');
const Functions = require('../functions/functions');
const Router = express.Router;

var listeners = [];
var dj = {};

const exportedApi = (io) => {
  let api = Router();

  io.on('connection', (socket) => {
    socket.on('listener', (user) => {
      ProfileActions.getProfileInfo(user)
      .then((user) => {
        if (Functions.isInArray(user, listeners) === false) {
        listeners.push(user);
        io.sockets.emit('updateParty', dj, listeners);
      }
      });

    });

    socket.on('dj', (user) => {
      ProfileActions.getProfileInfo(user)
      .then((user) => {
        dj = user;
        io.sockets.emit('updateParty', dj, listeners);
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
