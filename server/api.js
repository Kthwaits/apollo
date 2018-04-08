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
    console.log('connection')
    socket.on('room', (room) => {
      socket.join(room);
    });

    socket.on('listener', (user) => {
      ProfileActions.getProfileInfo(user)
        .then((user) => {
          if (dj.id === user.id) {
            dj = {};
          }
          if (Functions.isInArray(user, listeners) === false) {
            listeners.push(user);
            io.sockets.emit('updateParty', dj, listeners);
          }
        })
        .catch((err) => {
          console.log(err)
        });

    });

    socket.on('dj', (user) => {
      ProfileActions.getProfileInfo(user)
        .then((user) => {
          if (Functions.isInArray(user, listeners) === true) {
            listeners = Functions.removeFromArray(user, listeners);
          }
          dj = user;
          io.sockets.emit('updateParty', dj, listeners);
        })
        .catch((err) => {
          console.log(err)
        });
    });

    socket.on('getCurrentlyPlaying', (user) => {
      ProfileActions.getProfileInfo(user)
        .then((user) => {
          var room = user.room;
          PlaybackActions.getCurrentlyPlaying(user)
            .then((currentlyPlaying) => {
              io.sockets.to(room).emit('currentlyPlaying', JSON.stringify(currentlyPlaying);
            })
        }).catch((err) => {
          console.log(err)
        });
    });

    socket.on('sync', () => {
      console.log('sync');
      if (typeof(dj.id) !== 'undefined') {
        PlaybackActions.sync(dj, listeners);
      }
    });

    socket.on('leave', (user) => {
      ProfileActions.getProfileInfo(user)
        .then((user) => {
          if (Functions.isInArray(user, listeners) === true) {
            listeners = Functions.removeFromArray(user, listeners);
          } else if (dj.id === user.id) {
            dj = null;
          }
          io.sockets.emit('updateParty', dj, listeners);
        })
        .catch((err) => {
          console.log(err)
        });
    });

  });
  return api;
};

module.exports = exportedApi;
