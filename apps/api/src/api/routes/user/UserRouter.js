const UserRouter = require('express').Router();
const axios = require('axios');

UserRouter.get('/', async (req, res) => {
  let access_token = req.query.access_token;

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
      const statusCode = err.response.status;
      const errorMessage = err.response.headers['www-authenticate'];
      res.status(statusCode).send({ message: errorMessage });
    });
});

module.exports = UserRouter;
