const UserRouter = require('express').Router();
const axios = require('axios');

UserRouter.get('/', async (req, res) => {
  const access_token = req.query.access_token;

  const url = 'https://api.spotify.com/v1/me';
  await axios({
    method: 'GET',
    url: url,
    headers: { Authorization: 'Bearer ' + access_token },
  })
    .then((response) => {
      console.log(response.data);
      res.status(200).send({ user: response.data });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: 'User not found' });
    });
});

module.exports = UserRouter;
