const request = require('requestretry');
const currentlyPlayingOptions = require('../apiOptions/currentlyPlaying');
const playOptions = require('../apiOptions/play');
const seekOptions = require('../apiOptions/seek');

var currentlyPlayingInfo = {};

const getCurrentlyPlaying = (user) => {
  return new Promise(
  function (resolve, reject) {
  options = currentlyPlayingOptions.set(user.access_token);
  request.get(options)
    .then((response) => {
      if(response.body.item !== null) {
      currentlyPlayingInfo = {
        track: [response.body.item.uri],
        position: response.body.progress_ms,
        albumArt: response.body.item.album.images[0].url,
        artist: response.body.item.artists[0].name,
        song: response.body.item.name,
        duration: response.body.item.duration_ms
      };}
      else {
        currentlyPlayingInfo = {
          track: "none",
          position: "none",
          albumArt: "none",
          artist: "none",
          song: "none",
          duration: "none"
        };
      }
      resolve(currentlyPlayingInfo);
    })
    .catch((error) => {
      reject(error);
    });
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
