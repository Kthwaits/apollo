const set = (access_token, track) => {
  var playOptions = {
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    body: {
      'uris': track
    },
    json: true
  };
  return playOptions;
};

module.exports = {
  set
};
