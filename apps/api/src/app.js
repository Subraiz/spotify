const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const { AuthRouter, UserRouter, PlaylistRouter } = require('./api/routes');

const app = express();

// Set up default app settings
app.enable('view cache');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up passport OAuth 2.0 settings
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());

// Set up app router
app.use('/api', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/playlist', PlaylistRouter);

module.exports = app;
