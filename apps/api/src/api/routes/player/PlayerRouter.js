const PlayerRouter = require('express').Router();
const axios = require('axios');

PlayerRouter.get('/devices', async (req, res) => {
  const access_token = req.query.access_token;
  const url = 'https://api.spotify.com/v1/me/player/devices';
  await axios({
    method: 'GET',
    url,
    headers: { Authorization: 'Bearer ' + access_token },
  })
    .then(async (response) => {
      let devices = response.data;
      return res.status(200).send(devices);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = PlayerRouter;
