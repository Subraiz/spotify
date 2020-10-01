const UserRouter = require('express').Router();
const axios = require('axios');

UserRouter.get('/', async (req, res) => {
  let access_token = req.query.access_token;
  access_token =
    'BQBbb4F-TFfp_DU_qk8C7TkAcytiKwmVf4gQl6R6IV0UgjxCP51VhXu-nqcwH0_iiRbYey2se0FuC4RHAxHPTZ1Dvg1UyPhm-xxO-oZTwLeoe24G9ehC6pF6xdq8IZ-rFovarWYUXjEbBb-ryR-KRNsAjreGKrXyUFggvcL_ljoMpBgDeVwoRZodriyyotTuFDk7LW1h_HSEBc1aP8KtVSHn-b_e8aoli4Qjcj6erX-RjA';

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
