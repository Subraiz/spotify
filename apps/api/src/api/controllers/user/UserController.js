const axios = require('axios');

// initialize Firestore
const admin = require('firebase-admin');
const db = admin.firestore();

module.exports.getUser = async (access_token, birth, res) => {
  const url = 'https://api.spotify.com/v1/me';
  let user;
  await axios({
    method: 'GET',
    url: url,
    headers: { Authorization: 'Bearer ' + access_token },
  })
    .then((response) => {
      user = response.data;
    })
    .catch((err) => {
      const statusCode = err.response.status;
      const errorMessage = err.response.headers['www-authenticate'];
      return res.status(statusCode).send({ message: errorMessage });
    });

  if (birth !== undefined) {
    birth = JSON.parse(birth);
    db.collection('Users')
      .doc(user.id)
      .update({
        birth: birth,
      })
      .then()
      .catch((err) => {
        console.log(err);
      });
  }

  return user;
};

let User = module.exports;
