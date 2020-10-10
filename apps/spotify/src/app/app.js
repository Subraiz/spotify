import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import { isMobile } from 'react-device-detect';
import { SpotifyAuth } from '../components';
import Animation from './Animation';
import Playlist from './Playlist';

let serverUrl = 'http://localhost:5000/api';
serverUrl = 'https://starsignsbyti.com:4000/api';

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
  justify-content: flex-end;
  height: 50px;
  margin-top: 10px;
  width: 20vw;

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
    };
  }

  componentWillMount = async () => {
    let refreshToken = cookies.get('refresh_token');

    if (refreshToken === undefined) {
      if (window.location.search.includes('refresh_token')) {
        let urlParams = window.location.search.split('=');

        refreshToken = urlParams[2].split('&')[0];
        let accessToken = urlParams[1].split('&')[0];
        let userId = urlParams[3];

        cookies.set('refresh_token', refreshToken, { path: '/' });

        const user = await this.getUser(accessToken);
        const playlist = await this.getPlaylist(
          cookies.get('birthMonth'),
          cookies.get('birthDate'),
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
        });
        this.props.history.push('/');
      } else {
        this.setState({ authenticated: false, loading: false });
      }
    } else {
      let accessToken = await this.getNewAccessToken(refreshToken);
      const user = await this.getUser(accessToken);
      let userId = user.id;
      const playlist = await this.getPlaylist(
        cookies.get('birthMonth'),
        cookies.get('birthDate'),
        accessToken
      );

      this.setState({
        authenticated: true,
        loading: false,
        user,
        playlist,
        userId,
        refreshToken,
        accessToken,
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

  render() {
    const { loading, authenticated, accessToken, playlist } = this.state;

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
          <SecondContainer>
            {authenticated ? (
              <Playlist
                accessToken={accessToken}
                playlist={playlist}
                serverUrl={serverUrl}
              />
            ) : (
              <SpotifyAuth serverUrl={serverUrl} />
            )}
          </SecondContainer>
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
