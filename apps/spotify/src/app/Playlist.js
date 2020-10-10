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
      mobileIsAcitive: false,
      currentURI: undefined,
    };
  }

  componentWillMount = async () => {
    const { serverUrl, accessToken, playlist } = this.props;

    let tracks = playlist.tracks.map((track) => {
      return track.uri;
    });

    const t = setInterval(async () => {
      const deviceId = await this.getMobileDeviceId();
      if (deviceId !== undefined) {
        let url = serverUrl + '/player/start';

        await axios({
          method: 'POST',
          url,
          data: {
            device_id: deviceId,
            access_token: accessToken,
            uris: tracks,
          },
        })
          .then(async (res) => {
            console.log(res.data);
            this.setState({ mobileIsAcitive: true, startStream: true });
            clearInterval(t);
          })
          .catch((err) => {
            this.setState({ mobileIsAcitive: false, startStream: false });
          });
      }
    }, 1000);

    if (isMobile) {
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
            if (device.type === 'Smartphone' && device.is_active) {
              this.setState({ mobileIsAcitive: true });
              return;
            }
          }
        })
        .catch((err) => console.log(err));
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
          />
        </div>
      );
    }
  };

  setUpStreamForMobile = async () => {
    const { deviceId } = this.state;
    const { playlist, accessToken, serverUrl } = this.props;

    let tracks = playlist.tracks.map((track) => {
      return track.uri;
    });

    let url = serverUrl + '/player/start';

    await axios({
      method: 'POST',
      url,
      data: { device_id: deviceId, access_token: accessToken, uris: tracks },
    })
      .then(async (res) => {
        console.log(res.data);
      })
      .catch((err) => {
        this.setState({ mobileIsAcitive: false, startStream: false });
      });
  };

  openSpotifyApp = async () => {
    const { playlist } = this.props;
    let uri = playlist.tracks[0].uri.split(':')[2];

    let link = `https://open.spotify.com/track/${uri}`;

    window.location.href = link;

    //  this.setState({ startStream: true });
  };

  renderMobileStream = () => {
    const { startStream, mobileIsAcitive } = this.state;

    if (startStream || mobileIsAcitive) {
      return (
        <button
          onClick={async () => {
            const deviceId = await this.getMobileDeviceId();
            this.setState({ deviceId });
            this.setUpStreamForMobile();
            this.trackSpotifyState();
          }}
        >
          Start Experience
        </button>
      );
    } else {
      return (
        <div>
          <button
            onClick={async () => {
              this.openSpotifyApp();
            }}
          >
            Open Spotify
          </button>
        </div>
      );
    }
  };

  renderDesktopStream = () => {
    return (
      <div>
        <button
          onClick={() => {
            this.trackSpotifyState();
            this.setState({ startStream: true });
          }}
        >
          Start Experience
        </button>

        {this.renderStream()}
      </div>
    );
  };

  trackSpotifyState = () => {
    const { accessToken, serverUrl } = this.props;

    const t = setInterval(() => {
      const url = serverUrl + '/player';

      axios({
        method: 'GET',
        url,
        params: { device_id: this.state.deviceId, access_token: accessToken },
      })
        .then((res) => {
          let state = res.data;

          const currentURI = state.item.uri;

          if (currentURI !== this.state.currentURI) {
            console.log(state);
            this.setState({ currentURI });
          }
        })
        .catch((err) => {
          location.reload();
        });
    }, 1000);
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
