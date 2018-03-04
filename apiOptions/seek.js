const set = (access_token, position) => {
  var seekOptions = {
  url: `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  json: true
};
  return seekOptions;
};

module.exports = {
  set
};
