const PlaylistRouter = require('express').Router();
const axios = require('axios');

PlaylistRouter.post('/create', async (req, res) => {
  const {
    user_id,
    access_token,
    name,
    public,
    collaborative,
    description,
  } = req.body;
  const data = {
    name,
    description,
    public: public || false,
    collaborative: collaborative || false,
  };
  const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;

  const playlists = await getPlaylists(access_token);
  let playlistExists = playlists.filter(function (playlist) {
    return playlist.name === name;
  })[0];
  playlistExists = playlistExists == undefined ? false : true;

  if (!playlistExists) {
    await axios({
      method: 'POST',
      url,
      data: data,
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        res.status(200).send({ message: `Playlist ${name} has been created` });
      })
      .catch((err) => {
        res.status(400).send({
          message: 'Failed to create playlist, access token expired.',
        });
      });
  } else {
    res.status(400).send({ message: 'Playlist already exists.' });
  }
});

PlaylistRouter.get('/user', async (req, res) => {
  const access_token = req.query.access_token;
  const playlists = await getPlaylists(access_token);

  res.send(playlists);
});

const getPlaylists = async (access_token) => {
  const limit = 50;
  const url = 'https://api.spotify.com/v1/me/playlists';

  console.log(access_token);

  let playlists = [];

  await axios({
    method: 'GET',
    url,
    params: { limit },
    headers: { Authorization: 'Bearer ' + access_token },
  })
    .then((res) => {
      playlists = res.data.items;
      return playlists;
    })
    .catch((err) => {
      console.log(err);
    });

  return playlists;
};

module.exports = PlaylistRouter;
