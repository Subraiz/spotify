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

PlayerRouter.get('/', async (req, res) => {
  const access_token = req.query.access_token;
  const device_id = req.query.device_id;

  let url = 'https://api.spotify.com/v1/me/player/';
  await axios({
    method: 'GET',
    url,
    headers: { Authorization: 'Bearer ' + access_token },
    params: { device_id: device_id },
  })
    .then(async (response) => {
      return res.status(200).send(response.data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    });
});

PlayerRouter.post('/start', async (req, res) => {
  const { access_token, device_id, uris } = req.body;

  let url = 'https://api.spotify.com/v1/me/player/';
  await axios({
    method: 'GET',
    url,
    headers: { Authorization: 'Bearer ' + access_token },
    params: { device_id: device_id },
  })
    .then(async (response) => {
      const position_ms = response.data.progress_ms;
      url = 'https://api.spotify.com/v1/me/player/play';

      await axios({
        method: 'PUT',
        url,
        headers: { Authorization: 'Bearer ' + access_token },
        params: { device_id: device_id },
        data: { uris: uris, position_ms },
      })
        .then((response) => {
          return res.status(200).send({ message: 'Stream has been started.' });
        })
        .catch((err) => {
          return res.status(400).send({ message: 'Stream could not start.' });
        });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'Stream could not start.' });
    });
});

module.exports = PlayerRouter;
