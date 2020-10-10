import React, { Component } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import axios from 'axios';

const PlaylistContainer = styled.div`
  background: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 415px) {
    flex-direction: column;
    height: auto;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
  }
`;

const HoroscopeContainer = styled.div`
  display: flex;
  width: 20vw;
  flex-direction: column;
  height: 80vh;
  margin-right: 4vw;
  justify-content: space-between;

  font-family: 'Merriweather', serif;

  @media (max-width: 415px) {
    width: 80vw;
    margin-right: 0;
    justify-content: flex-start;
    margin-top: 15px;
  }
`;

const HoroscopeVideoContainer = styled.div`
  width: 100%;
  height: 600px;
  background-color: #f8e3b3;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #d2a038;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 415px) {
    height: 300px;
    min-height: 200px;
  }
`;

const HoroscopeSign = styled.p`
  text-transform: capitalize;
  text-align: center;
`;

const HoroscopeText = styled.p`
  text-align: center;
  line-height: 1.2;

  @media (max-width: 415px) {
    line-height: 1;
  }
`;

const WebPlaylistInfo = styled.div`
  display: flex;
  width: 30vw;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
  font-family: 'Merriweather', serif;

  @media (max-width: 415px) {
    width: 80vw;
    height: auto;
  }
`;

const WebSongDetailsContainer = styled.div`
  height: 90%;
  overflow-y: scroll;
  border-radius: 10px;
  border: 2px solid #d2a038;
  background-color: #f8e3b3;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 415px) {
    height: 35vh;
    margin-bottom: 20px;
    border: 0px solid black;
  }
`;

const CurrentSong = styled.p`
  color: black;
  font-weight: 700;
  padding-left: 10px;
  border-bottom: 1px solid #000;
  margin: 10px 15px;

  padding: 5px 10px;
`;

const Song = styled.p`
  color: #474747;
  font-weight: 400;
  padding-left: 10px;
  border-bottom: 1px solid #000;
  margin: 10px 15px;

  padding: 5px 10px;
`;

const ZodiacSignContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ZodiacSign = styled.p`
  color: black;
  font-weight: 700;
  padding-left: 10px;
  margin: 15px 0;
  padding-bottom: 5px;
  text-transform: capitalize;

  @media (max-width: 415px) {
    font-weight: 400;
    border: 0px solid black;
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Player = styled.div`
  width: 60%;
`;

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

      const searchForDevice = setInterval(async () => {
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
              this.trackSpotifyState();
              this.setState({ mobileIsAcitive: true });
              clearInterval(searchForDevice);
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
    const { playlist } = this.props;

    if (mobileIsAcitive) {
      return (
        <PlaylistContainer>
          <HoroscopeContainer>
            <HoroscopeSign>TI HOROSCOPE APP</HoroscopeSign>
            <HoroscopeVideoContainer></HoroscopeVideoContainer>
            <HoroscopeSign>{playlist.sign}</HoroscopeSign>
            <HoroscopeText>
              {`  It may seem like everyone around you is happy and getting what
              they want while you're stuck in the trenches, Leo. Don't compare
              yourself to other people and make judgments based on outside
              appearances. The truth of the matter is that they're most likely
              only looking at the immediate future and experiencing short-term
              pleasures. You, however, have your sights set on the long-term and
              will probably be much better off.`}
            </HoroscopeText>
          </HoroscopeContainer>

          <WebPlaylistInfo>
            <ZodiacSignContainer>
              <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
              <button className="btn save-btn">Save to Spotify</button>
            </ZodiacSignContainer>
            <WebSongDetailsContainer>
              {this.renderPlaylistSongNames()}
            </WebSongDetailsContainer>

            <PlayerContainer></PlayerContainer>
          </WebPlaylistInfo>
        </PlaylistContainer>
      );
    } else {
      return (
        <div className="horoscope-btn-container">
          <button
            className="btn share-button horoscope-button"
            onClick={async () => {
              this.openSpotifyApp();
            }}
          >
            Get My Horoscope
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
          className="horoscope-button"
          onClick={() => {
            this.trackSpotifyState();
            this.setState({ startStream: true });
          }}
        >
          Get My Horoscope
        </button>
      );
    } else {
      return (
        <PlaylistContainer>
          <HoroscopeContainer>
            <HoroscopeVideoContainer></HoroscopeVideoContainer>
            <HoroscopeSign>{playlist.sign}</HoroscopeSign>
            <HoroscopeText>
              {`  It may seem like everyone around you is happy and getting what
              they want while you're stuck in the trenches, Leo. Don't compare
              yourself to other people and make judgments based on outside
              appearances. The truth of the matter is that they're most likely
              only looking at the immediate future and experiencing short-term
              pleasures. You, however, have your sights set on the long-term and
              will probably be much better off.`}
            </HoroscopeText>
          </HoroscopeContainer>

          <WebPlaylistInfo>
            <WebSongDetailsContainer>
              <ZodiacSignContainer>
                <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
              </ZodiacSignContainer>
              {this.renderPlaylistSongNames()}
            </WebSongDetailsContainer>

            <PlayerContainer>
              <Player>
                <SpotifyPlayer
                  name={'Spotify Web (The Libra)'}
                  token={accessToken}
                  uris={tracks}
                  autoPlay={true}
                  persistDeviceSelection
                  syncExternalDevice
                  styles={{
                    bgColor: '#f8e3b3',
                    sliderColor: '#d2a038',
                    sliderHandleColor: '#d2a038',
                    sliderTrackColor: '#000',
                    trackArtistColor: '#d2a038',
                  }}
                />
              </Player>
              <button className="btn save-btn">Save Playlist</button>
            </PlayerContainer>
          </WebPlaylistInfo>
        </PlaylistContainer>
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
