const set = (access_token) => {
  var currentlyPlayingOptions = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    json: true
  };
  return currentlyPlayingOptions;
};

module.exports = {
  set
};
