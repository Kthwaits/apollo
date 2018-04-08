const request = require('requestretry');
const profileOptions = require('../apiOptions/profileOptions');

const getProfileInfo = (user) => {
  return new Promise(
    function (resolve, reject) {
      var access_token = user.access_token;
      //var refresh_token = user.refresh_token;
      var socket_id = user.socket_id;
      var room = user.room;
      options = profileOptions.set(access_token);
      request.get(options)
        .then((response) => {
          response = response.toJSON();
          user = response.body;
          user.room = room;
          user.access_token = access_token;
          //user.refresh_token = refresh_token;
          user.socket_id = socket_id;
          resolve(user);
        })
        .catch((err) => {
          reject(error);
        });
    }
  )
};

module.exports = {
  getProfileInfo
};
