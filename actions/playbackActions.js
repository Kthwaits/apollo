const request = require('requestretry');
const currentlyPlayingOptions = require('../apiOptions/currentlyPlaying');
const playOptions = require('../apiOptions/play');
const seekOptions = require('../apiOptions/seek');

var currentlyPlayingInfo = {};

const getCurrentlyPlaying = (user) => {
  options = currentlyPlayingOptions.set(user.access_token);
  request.get(options)
    .then((response) => {
      currentlyPlayingInfo = {
        track: [response.body.item.uri],
        position: response.body.progress_ms
      };
      return currentlyPlayingInfo;
    });
};

const setPlaying = (user, track, position) => {
  options = playOptions.set(user.access_token, track);
  request.put(options)
  .then((response) => {
    options = seekOptions.set(user.access_token, position);
    request.put(options)
    .catch((error) => {
      console.log(error);
    })
  })
};


const sync = (dj, listeners) => {
  options = currentlyPlayingOptions.set(dj.access_token);
  request.get(options)
    .then((response) => {
      currentlyPlayingInfo = {
        track: [response.body.item.uri],
        position: response.body.progress_ms
      };
      setPlaying(dj, currentlyPlayingInfo.track, currentlyPlayingInfo.position);
      listeners.forEach((user) => {
        setPlaying(user, currentlyPlayingInfo.track, currentlyPlayingInfo.position);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    ;
};

module.exports = {
  getCurrentlyPlaying,
  setPlaying,
  sync
};
