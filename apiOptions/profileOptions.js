const set = (access_token) => {
  var profileOptions = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    json: true
  };
  return profileOptions;
};

module.exports = {
  set
};
