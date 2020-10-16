const axios = require('axios');
const btoa = require('btoa');
require('dotenv').config();

// initialize Firestore
const admin = require('firebase-admin');
const serviceAccount = require('../../../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports.createUser = (profile, accessToken, refreshToken) => {
  const user = {
    name: profile.displayName,
    email: profile.emails[0].value,
    userId: profile.id,
    country: profile.country,
    profileUrl: profile.profileUrl,
    membership: profile.product,
    followers: profile.followers,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };

  return user;
};

module.exports.checkForUserError = (user) => {
  console.log(user);

  db.collection('Users')
    .doc(user.userId)
    .set(user, { merge: true })
    .then(function () {
      console.log('No error exists in user object');
    })
    .catch(function (error) {
      console.error('Error in user object: ', error);
    });

  return false;
};

module.exports.refreshAccessToken = async (refresh_token, req, res) => {
  let new_access_token = '';

  const grant_type = 'refresh_token';
  const reqData = {
    grant_type,
    refresh_token,
  };

  const url = 'https://accounts.spotify.com/api/token';
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
      Authorization:
        'Basic ' +
        btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
    },
  })
    .then((response) => {
      new_access_token = response.data.access_token;
    })
    .catch((err) => {
      console.log(err);
    });
  return new_access_token;
};

let Auth = module.exports;
