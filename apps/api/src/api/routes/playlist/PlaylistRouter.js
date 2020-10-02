const PlaylistRouter = require('express').Router();
const Playlists = require('./Playlists');
const axios = require('axios');

PlaylistRouter.post('/save', async (req, res) => {
  let { user_id, access_token, playlist_id } = req.body;

  const playlists = await getUserPlaylists(access_token);
  let playlistExists = playlists.filter(function (playlist) {
    return playlist.id === playlist_id;
  })[0];
  playlistExists = playlistExists == undefined ? false : true;

  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers`;
  if (!playlistExists) {
    await axios({
      method: 'PUT',
      url,
      data: { public: false },
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        res
          .status(200)
          .send({ message: `Playlist ${playlist_id} has been added.` });
      })
      .catch((err) => {
        console.log(err.message);
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
  const playlists = await getUserPlaylists(access_token);
  res.send(playlists);
});

PlaylistRouter.get('/sign', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  const access_token = req.query.access_token;
  const zodiacSign = await getZodiacSign(month, day);
  const playlist = Playlists[zodiacSign];

  if (day !== undefined && month !== undefined) {
    const url = `https://api.spotify.com/v1/playlists/${playlist.playlist_id}/tracks`;
    await axios({
      method: 'GET',
      url,
      params: { fields: 'items(track(uri))' },
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        let tracks = [];
        response.data.items.forEach((track) => {
          const uri = track.track.uri;
          tracks.push(uri);
        });
        playlist.tracks = tracks;

        res.status(200).send(playlist);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

// Helper function to get user playlists
const getUserPlaylists = async (access_token) => {
  const limit = 50;
  const url = 'https://api.spotify.com/v1/me/playlists';

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

// Helper function to find zodiac sign and get associated playlist
function getZodiacSign(month, day) {
  var zodiacSigns = {
    capricorn: 'capricorn',
    aquarius: 'aquarius',
    pisces: 'pisces',
    aries: 'aries',
    taurus: 'taurus',
    gemini: 'gemini',
    cancer: 'cancer',
    leo: 'leo',
    virgo: 'virgo',
    libra: 'libra',
    scorpio: 'scorpio',
    sagittarius: 'sagittarius',
  };

  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
    return zodiacSigns.capricorn;
  } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
    return zodiacSigns.aquarius;
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return zodiacSigns.pisces;
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
    return zodiacSigns.aries;
  } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return zodiacSigns.taurus;
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return zodiacSigns.gemini;
  } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
    return zodiacSigns.cancer;
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
    return zodiacSigns.leo;
  } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
    return zodiacSigns.virgo;
  } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
    return zodiacSigns.libra;
  } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
    return zodiacSigns.scorpio;
  } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
    return zodiacSigns.sagittarius;
  }
}

module.exports = PlaylistRouter;
