const AuthRouter = require('express').Router();
const querystring = require('querystring');
const btoa = require('btoa');
const axios = require('axios');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const creds = require('../../../environments/creds');

const callbackPath = '/auth/spotify/callback';

// Set up spotify passport strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: creds.clientId,
      clientSecret: creds.clientSecret,
      callbackURL: 'http://localhost:4000/api' + callbackPath,
    },
    // Function to serialize the user and get the data back in the callback route
    function (accessToken, refreshToken, expires_in, profile, done) {
      return done(null, { accessToken, refreshToken, profile, expires_in });
    }
  )
);

// Implement passport to authenticate with Spotify
AuthRouter.get(
  '/auth',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'user-read-private',
      'streaming',
      'playlist-read-private',
      'playlist-modify-private',
      'user-library-read',
    ],
    showDialog: true,
  }),
  (req, res) => {
    // Since there is a redirect this part doesn't get reached
  }
);

// Execute this function after user sings in with Spotify
AuthRouter.get(
  callbackPath,
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log();
    const { accessToken, refreshToken, profiile } = req._passport.session.user;

    console.log(accessToken, refreshToken);

    // Redirect back to the frontend and pass in both tokens as querys
    const query = querystring.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    res.redirect('http://localhost:4200/?' + query);
  }
);

// Pass in a refresh token to generate a new access token for an hour
AuthRouter.post('/auth/refresh', async (req, res) => {
  const url = 'https://accounts.spotify.com/api/token';

  const { refresh_token } = req.body;
  const grant_type = 'refresh_token';
  const auth = 'Basic ' + btoa(creds.clientId + ':' + creds.clientSecret);

  const reqData = {
    grant_type,
    refresh_token,
  };

  await axios({
    method: 'POST',
    url: url,
    data: Object.keys(reqData)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]);
      })
      .join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: auth,
    },
  })
    .then((response) => {
      res.status(200).send({
        access_token: response.data.access_token,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: 'Invalid refresh token.' });
    });
});

module.exports = AuthRouter;
