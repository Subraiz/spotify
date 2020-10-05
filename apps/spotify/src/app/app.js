import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import { SpotifyConnect } from '../components';

const serverUrl = 'http://localhost:4000/api';

const cookies = new Cookies();

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
  justify-content: space-between;
`;

const FirstContainer = styled.div`
  width: 20vw;
  margin-left: 10px;
  margin-top: 10px;

  .video-placeholder {
    max-width: 100%;
    height: 100px;
    background-color: gray;
  }

  p {
    font-family: Montserrat;
  }
`;

const SecondContainer = styled.div`
  height: 100vh;
  max-width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThirdContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  margin-top: 10px;

  button {
    margin-right: 10px;
    border-radius: 25px;
    width: 120px;
    font-famliy: Montserrat;
    color: white;
    padding: 10px 15px;
    background-color: grey;
    border: 0px solid black;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
  width: 100vw;
  height: 100vh;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      loading: true,
      userId: null,
      accessToken: null,
      refreshToken: null,
      user: {},
      playlist: {},
      birthMonth: 4,
      birthDate: 5,
      birthYear: 1998,
      currentSong: undefined,
      autoPlay: true,
    };
  }

  componentWillMount = async () => {
    let refreshToken = cookies.get('refresh_token');
    let userId = cookies.get('user_id');
    let birth = cookies.get('birth');

    if (refreshToken === undefined) {
      let urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      userId = urlParams.get('user_id');
      refreshToken = urlParams.get('refresh_token');

      if (userId !== null && accessToken !== null && refreshToken !== null) {
        const { birthMonth, birthDate, birthYear } = this.state;
        cookies.set('birth', [birthMonth, birthDate, birthYear], { path: '/' });
        cookies.set('refresh_token', refreshToken, { path: '/' });
        cookies.set('access_token', accessToken, { path: '/' });
        cookies.set('user_id', userId, { path: '/' });
        const user = await this.getUser(accessToken);
        const playlist = await this.getPlaylist(
          birth[0],
          birth[1],
          accessToken
        );

        this.setState({
          authenticated: true,
          loading: false,
          user,
          playlist,
          userId,
          accessToken,
          refreshToken,
          currentSong: playlist.tracks[0].uri,
        });
        this.props.history.push('/');
      } else {
        this.setState({ authenticated: false, loading: false });
      }
    } else {
      const accessToken = await this.getNewAccessToken(refreshToken);
      cookies.set('access_token', accessToken, { path: '/' });

      const user = await this.getUser(accessToken);
      const playlist = await this.getPlaylist(birth[0], birth[1], accessToken);

      this.setState({
        authenticated: true,
        loading: false,
        user,
        userId,
        refreshToken,
        accessToken,
        playlist: playlist,
        birthDate: birth[1],
        birthMonth: birth[0],
        birthYear: birth[2],
        currentSong: playlist.tracks[0].uri,
      });
    }
  };

  getNewAccessToken = async (refreshToken) => {
    const url = `${serverUrl}/auth/refresh`;
    let accessToken;

    await axios({
      method: 'POST',
      url,
      data: { refresh_token: refreshToken },
    }).then((res) => {
      accessToken = res.data.access_token;
    });

    return accessToken;
  };

  getUser = async (accessToken) => {
    const url = `${serverUrl}/user`;
    let user;

    await axios({
      method: 'GET',
      url,
      params: { access_token: accessToken },
    })
      .then((res) => {
        user = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return user;
  };

  getPlaylist = async (month, day, accessToken) => {
    const url = `${serverUrl}/playlist/sign`;
    let playlist;

    await axios({
      method: 'GET',
      url,
      params: { month, day, access_token: accessToken },
    })
      .then((res) => {
        playlist = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return playlist;
  };

  handleBirthChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderPlaylist = () => {
    const { playlist } = this.state;

    const tracks = playlist.tracks.slice(0, 10);

    return playlist.tracks.map((song, i) => {
      return (
        <button
          key={i}
          onClick={() => {
            this.setState({ currentSong: song.uri });
          }}
        >
          {song.name}
        </button>
      );
    });
  };

  renderSpotifyConnect = () => {
    const { authenticated, user, accessToken } = this.state;
    const { birthMonth, birthDate, birthYear } = this.state;
    const { playlist, currentSong, autoPlay } = this.state;

    if (authenticated) {
      return (
        <div>
          <div style={{ marginBottom: 20 }}>{this.renderPlaylist()}</div>
          <SpotifyPlayer
            name={'testing'}
            token={accessToken}
            uris={[currentSong]}
            autoPlay={autoPlay}
            persistDeviceSelection
            syncExternalDevice
          />
        </div>
      );
    } else {
      return (
        <SpotifyConnect
          serverUrl={serverUrl}
          month={birthMonth}
          year={birthYear}
          day={birthDate}
          handleInputChange={this.handleBirthChange.bind(this)}
        />
      );
    }
  };

  render() {
    const { authenticated, loading, user, playlist } = this.state;
    if (!loading) {
      return (
        <StyledApp>
          <FirstContainer>
            <div className="video-placeholder" />
            <p>
              Hey there it’s TI, to celebrate the release of my new album,
              Horoscopes, I put together some hororscopes for your zodiac sign.
            </p>
          </FirstContainer>
          <SecondContainer>{this.renderSpotifyConnect()}</SecondContainer>
          <ThirdContainer>
            <button>Share</button>
            <button>Stream</button>
          </ThirdContainer>
        </StyledApp>
      );
    } else {
      return <LoadingContainer />;
    }
  }
}
export default withRouter(App);
