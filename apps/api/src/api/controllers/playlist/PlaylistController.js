const axios = require('axios');
const PlaylistData = require('./PlaylistData');
// Save a playlist to a user's Spotify account
module.exports.addPlaylistToUser = async (
  playlist_id,
  access_token,
  followingPlaylist,
  res
) => {
  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers`;
  let succesfullyAddedPlaylist = false;

  if (!followingPlaylist) {
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
        succesfullyAddedPlaylist = true;
      })
      .catch((err) => {
        console.log(err.message);
        succesfullyAddedPlaylist = false;
      });
  } else {
    succesfullyAddedPlaylist = true;
  }

  return succesfullyAddedPlaylist;
};

// Grab the playlist associated with a user's zodiac sign
module.exports.getPlaylistByZodiacSign = async (
  access_token,
  month,
  day,
  res
) => {
  const zodiacSign = Playlist.getZodiacSign(month, day);
  let playlist = PlaylistData[zodiacSign];

  const url = `https://api.spotify.com/v1/playlists/${playlist.playlist_id}/tracks`;
  await axios({
    method: 'GET',
    url,
    params: { fields: '' },
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      let tracks = [];
      response.data.items.forEach((track) => {
        const name = track.track.name;
        const uri = track.track.uri;
        tracks.push({ name, uri });
      });
      playlist.tracks = tracks;
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).send({ message: 'Could not retreive playlist.' });
    });

  return playlist;
};

// Check if user is already following a playlist
module.exports.userIsFollowingPlaylist = async (
  userId,
  playlistId,
  accessToken
) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains`;
  let isFollowing = false;

  await axios({
    method: 'GET',
    url,
    params: { ids: userId },
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      isFollowing = response.data[0];
    })
    .catch((err) => {
      console.log(err);
    });

  return isFollowing;
};

// Retrive user's current playliists
module.exports.getUserPlaylists = async (access_token) => {
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

// Get user's zodiac sign
module.exports.getZodiacSign = (month, day) => {
  const zodiacSigns = {
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
};

let Playlist = module.exports;
