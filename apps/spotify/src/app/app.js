import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router';
import SpotifyPlayer, { STATUS } from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import { isMobile } from 'react-device-detect';
import ZodiacWheel from '../assets/Wheel.png';
import AlbumLogo from '../assets/AlbumLogo.png';
import { SpotifyAuth } from '../components';
import Animation from './Animation';
import Playlist from './Playlist';
import styles from './home.css';

let serverUrl = 'http://localhost:5000/api';
serverUrl = 'https://starsignsbyti.com:4000/api';

const cookies = new Cookies();

const SpinningZodiacWheel = styled.div`
  position: absolute;
  background-image: url(${ZodiacWheel});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 106vh;
  top: -3vh;
  opacity: 0.4;
  width: 100vw;
  z-index: -1;
  animation: ${(props) => (props.animate ? 'spin' : null)} 60s linear;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 415px) {
    display: none;
  }
`;

const StyledApp = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 415px) {
    flex-direction: column;
    overflow: scroll;
    justify-content: flex-start;
  }
`;

const FirstContainer = styled.div`
  width: 20vw;
  margin-left: 25px;
  margin-top: 25px;

  .logo-placeholder {
    max-width: 100%;
    height: 180px;
    background-image: url(${AlbumLogo});
    background-size: contain;
    background-repeat: no-repeat;
  }

  p {
    font-family: 'Merriweather', serif;
    font-weight: 300;
    font-size: 22px;
  }

  @media (max-width: 415px) {
    width: 100vw;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;

    .logo-placeholder {
      width: 50vw;
      margin: auto;
      max-height: 100px;
    }

    p {
      padding-left: 0px;
      align-self: center;
      font-size: 14px;
    }
  }
`;

const SecondContainer = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 25%;
  margin: 0 auto;

  @media (max-width: 415px) {
    align-items: flex-start;
    width: 100vw;
    margin: 0 auto;
    left: 0;
    position: relative;
    height: auto;
  }
`;

const ThirdContainer = styled.div`
  margin-top: 25px;
  margin-right: 25px;

  @media (max-width: 415px) {
    display: none;
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
    let birthMonth = cookies.get('birth_month');

    if (refreshToken === undefined && birthMonth === undefined) {
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
          <SpinningZodiacWheel animate={true} />
          <FirstContainer>
            <div className="logo-placeholder" />
            {!authenticated ? (
              <p>
                Hi this is T.I. <br />
                My new album L.I.B.R.A is <br />
                available now. <br />
                Find out your fortune and <br />
                bless up.
              </p>
            ) : null}
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
            {!authenticated ? (
              <button className={'btn share-button'}>Share</button>
            ) : null}

            <button className={'btn stream-button'}>Stream</button>
          </ThirdContainer>
        </StyledApp>
      );
    } else {
      return <LoadingContainer />;
    }
  }
}
export default withRouter(App);
