const AuthRouter = require('express').Router();
const querystring = require('querystring');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { Auth } = require('../../controllers');
require('dotenv').config(); // Access .env variables

const callbackPath = '/auth/spotify/callback'; // Set callback path for authentication

const SCOPES = [
  'user-read-email',
  'user-read-private',
  'streaming',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-read',
  'user-read-playback-state',
  'user-modify-playback-state',
]; // Set permissions we will need from Spotify for the user

// Set up spotify passport strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.API_URL + callbackPath,
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
    scope: SCOPES,
    showDialog: true,
  }),
  (req, res) => {
    // Since there is a redirect this part doesn't get reached
  }
);

// Execute this function after user sings in with Spotify
AuthRouter.get(
  callbackPath,
  passport.authenticate('spotify', {
    failureRedirect: '/api/auth/failed',
  }),
  async (req, res) => {
    const { accessToken, refreshToken, profile } = req._passport.session.user;

    const user = Auth.createUser(profile, accessToken, refreshToken);
    //Auth.uploadUser(user);

    // Redirect back to the frontend and pass in both tokens as querys
    const query = querystring.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.userId,
    });
    return res.redirect(`${process.env.WEBSITE_URL}/?` + query);
  }
);

AuthRouter.get('/auth/failed', async (req, res) => {
  return res.redirect(`${process.env.WEBSITE_URL}`);
});

// Pass in a refresh token to generate a new access token for an hour
AuthRouter.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const newAccessToken = await Auth.refreshAccessToken(refresh_token, req, res);
  return res.status(200).send({ access_token: newAccessToken });
});

module.exports = AuthRouter;
