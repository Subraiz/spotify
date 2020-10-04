const PlaylistRouter = require('express').Router();
const { Playlist } = require('../../controllers');
const axios = require('axios');

PlaylistRouter.post('/save', async (req, res) => {
  let { user_id, playlist_id, access_token } = req.body;

  const followingPlaylist = await Playlist.userIsFollowingPlaylist(
    user_id,
    playlist_id,
    access_token
  );

  const succesfullyAddedPlaylist = await Playlist.addPlaylistToUser(
    playlist_id,
    access_token,
    followingPlaylist,
    res
  );

  if (succesfullyAddedPlaylist) {
    return res
      .status(200)
      .send({ message: `Playlist ${playlist_id} has been added.` });
  } else {
    return res.status(400).send({ message: `Error in adding playlist.` });
  }
});

PlaylistRouter.get('/user', async (req, res) => {
  const access_token = req.query.access_token;
  const playlists = await Playlist.getUserPlaylists(access_token);
  res.send(playlists);
});

PlaylistRouter.get('/sign', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  const access_token = req.query.access_token;

  if (day !== undefined && month !== undefined) {
    const playlist = await Playlist.getPlaylistByZodiacSign(
      access_token,
      month,
      day,
      res
    );
    return res.status(200).send(playlist);
  }
});

module.exports = PlaylistRouter;
