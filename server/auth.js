const express = require('express');
const querystring = require('querystring');
const request = require('requestretry');

const Router = express.Router;
const AppConfig = require('../config/app');
const AuthConfig = require('../config/auth');
const Functions = require('../functions/functions')

const redirect_uri = `${AppConfig.HOST}/auth/callback`;
const client_id = AuthConfig.CLIENT_ID;
const client_secret = AuthConfig.CLIENT_SECRET;

let auth = Router();

var stateKey = 'spotify_auth_state';

auth.get('/login', function(req, res) {
  var state = Functions.generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    })
  );
});

auth.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.log('state mismatch', 'state: ' + state, 'storedState ' + storedState, 'cookies ', req.cookies);
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
            // console.log(access_token);
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {

        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

auth.post('/token', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var refreshToken = req.body ? req.body.refresh_token : null;
  if (refreshToken) {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token, expires_in = body.expires_in;

        res.setHeader('Content-Type', 'application/json');
        res.send(
          JSON.stringify({
            access_token: access_token,
            expires_in: expires_in
          })
        );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ access_token: '', expires_in: '' }));
      }
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ access_token: '', expires_in: '' }));
  }
});

module.exports = auth;
