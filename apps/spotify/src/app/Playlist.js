import React, { Component } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import axios from 'axios';

const WebPlaylistContainer = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WebPlaylistInfo = styled.div`
  display: flex;
  width: 45vw;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
`;

const WebSongDetailsContainer = styled.div`
  height: 90%;
  overflow-y: scroll;
  border: 1px solid black;
`;

const CurrentSong = styled.p`
  font-family: Montserrat;
  color: black;
  font-weight: 700;
  padding-left: 10px;
  border-bottom: 1px solid #e7e7e7;
  margin: 10px 0;
  padding-bottom: 5px;
`;

const Song = styled.p`
  font-family: Montserrat;
  color: #474747;
  font-weight: 400;
  padding-left: 10px;
  border-bottom: 1px solid #e7e7e7;
  margin: 10px 0;
  padding-bottom: 5px;
`;

const ZodiacSign = styled.p`
  font-family: Montserrat;
  color: black;
  font-weight: 700;
  padding-left: 10px;
  border-bottom: 1px solid #e7e7e7;
  margin: 15px 0;
  padding-bottom: 5px;
  text-transform: capitalize;
`;

const PlayerContainer = styled.div``;

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startStream: false,
      deviceId: undefined,
      mobileIsAcitive: false,
      currentURI: undefined,
    };
  }

  componentWillMount = async () => {
    const { serverUrl, accessToken, playlist } = this.props;

    if (isMobile) {
      let tracks = playlist.tracks.map((track) => {
        return track.uri;
      });

      const searchForDevicce = setInterval(async () => {
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
              this.setState({ mobileIsAcitive: true });
              this.trackSpotifyState();
              clearInterval(searchForDevicce);
            })
            .catch((err) => {
              this.setState({ mobileIsAcitive: false });
            });
        }
      }, 1000);
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

  renderPlaylistSongNames = () => {
    const { playlist } = this.props;
    const { currentURI } = this.state;

    return playlist.tracks.map((song, i) => {
      if (song.uri === currentURI) {
        return <CurrentSong key={i}>{song.name}</CurrentSong>;
      } else {
        return <Song key={i}>{song.name}</Song>;
      }
    });
  };

  openSpotifyApp = async () => {
    const { playlist } = this.props;
    let link = `https://open.spotify.com/playlist/${playlist.playlist_id}`;
    window.location.href = link;
  };

  renderMobileStream = () => {
    const { mobileIsAcitive, currentURI } = this.state;

    if (mobileIsAcitive) {
      return (
        <div>
          <p>{currentURI}</p>
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={async () => {
              this.openSpotifyApp();
            }}
          >
            Start Experience
          </button>
        </div>
      );
    }
  };

  renderDesktopStream = () => {
    const { startStream } = this.state;
    const { playlist, accessToken } = this.props;

    let tracks = playlist.tracks.map((track) => {
      return track.uri;
    });

    if (!startStream) {
      return (
        <button
          onClick={() => {
            this.trackSpotifyState();
            this.setState({ startStream: true });
          }}
        >
          Start Experience
        </button>
      );
    } else {
      return (
        <WebPlaylistContainer>
          <WebPlaylistInfo>
            <WebSongDetailsContainer>
              <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
              {this.renderPlaylistSongNames()}
            </WebSongDetailsContainer>

            <PlayerContainer>
              <SpotifyPlayer
                name={'Spotify Web (The Libra)'}
                token={accessToken}
                uris={tracks}
                autoPlay={true}
                persistDeviceSelection
                syncExternalDevice
                styles={{
                  fontFamily: 'Arial',
                }}
              />
            </PlayerContainer>
          </WebPlaylistInfo>
        </WebPlaylistContainer>
      );
    }
  };

  trackSpotifyState = () => {
    const { accessToken, serverUrl } = this.props;

    const updateState = setInterval(() => {
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
    {
      if (isMobile) {
        {
          return this.renderMobileStream();
        }
      } else {
        return this.renderDesktopStream();
      }
    }
  }
}

export default Playlist;
