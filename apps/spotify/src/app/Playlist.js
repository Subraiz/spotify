import React, { Component } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import axios from 'axios';

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startStream: false,
      displayStream: true,
      deviceId: undefined,
    };
  }

  componentWillMount = async () => {
    if (isMobile) {
      const deviceId = await this.getMobileDeviceId();
      if (deviceId !== undefined) {
        this.setUpStreamForMobile();
      }
    }
  };

  getMobileDeviceId = async () => {
    let deviceId;
    const { serverUrl, accessToken } = this.props;
    const url = serverUrl + '/player/devices';

    await axios({
      method: 'GET',
      url,
      params: { access_token: accessToken },
    })
      .then((res) => {
        let devices = res.data.devices;
        for (let i = 0; i < devices.length; i++) {
          let device = devices[i];
          if (device.type === 'Smartphone') {
            deviceId = device.id;
            return;
          }
        }
      })
      .catch((err) => console.log(err));

    return deviceId;
  };

  renderPlaylist = () => {
    const { playlist } = this.props;

    return playlist.tracks.map((song, i) => {
      return <button key={i}>{song.name}</button>;
    });
  };

  renderStream = () => {
    const { startStream, displayStream } = this.state;
    const { playlist, accessToken } = this.props;

    let tracks = playlist.tracks.map((track) => {
      return track.uri;
    });

    if (startStream) {
      return (
        <div style={{ opacity: displayStream ? 1 : 0, marginTop: 20 }}>
          <div style={{ marginBottom: 20 }}>{this.renderPlaylist()}</div>

          <SpotifyPlayer
            name={'Spotify Web (The Libra)'}
            token={accessToken}
            uris={tracks}
            autoPlay={true}
            persistDeviceSelection
            syncExternalDevice
            play={false}
            callback={(state) => {
              console.log(state);
            }}
          />
        </div>
      );
    }
  };

  setUpStreamForMobile = async () => {
    const { deviceId } = this.state;
    const { playlist, accessToken } = this.props;

    let tracks = playlist.tracks.map((track) => {
      return track.uri;
    });

    let url = 'https://api.spotify.com/v1/me/player/play';
    await axios({
      method: 'PUT',
      url,
      headers: { Authorization: 'Bearer ' + accessToken },
      params: { device_id: deviceId },
      data: { uris: tracks },
    }).then((res) => {});
  };

  openSpotifyApp = async () => {
    const { playlist } = this.props;
    let uri = playlist.tracks[0].uri.split(':')[2];

    let link = `https://open.spotify.com/track/${uri}`;

    await window.location.href = link;

    const deviceId = await this.getMobileDeviceId();
    this.setState({ deviceId });
  };

  renderMobileStream = () => {
    const { playlistId } = this.state;

    return (
      <div>
        <button
          onClick={async () => {
            this.openSpotifyApp();
          }}
        >
          {`Start Mobile Stream ${playlistId}`}
        </button>
      </div>
    );
  };

  renderDesktopStream = () => {
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ startStream: true });
          }}
        >
          Start Experience
        </button>

        {this.renderStream()}
      </div>
    );
  };

  render() {
    const { startStream, deviceId } = this.state;

    return (
      <div>
        {isMobile ? this.renderMobileStream() : this.renderDesktopStream()}
      </div>
    );
  }
}

export default Playlist;
