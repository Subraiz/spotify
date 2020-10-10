import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Route, Link } from 'react-router-dom';

const cookies = new Cookies();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20vw;

  .auth-video-container {
    width: 100%;
    height: 50vh;
    background-color: #f9e3b3;
    border-radius: 10px;
    border: 2px solid #d2a038;
    overflow: hidden;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  }

  p {
    font-family: 'Merriweather', serif;
    font-weight: 300;
    text-align: center;
  }

  .birthday-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  input {
    width: 27%;
    background-color: #f8e3b3;
    border-radius: 5px;
    border: 1px solid #d2a038;
    padding: 8px 20px;
    margin-right: 2%;
    font-family: 'Merriweather', serif;
    font-weight: 300;
  }

  a {
    padding: 18px 25px;
    background-color: black;
    color: white;
    font-family: 'Merriweather', serif;
    font-weight: 300;
    text-align: center;
    margin-top: 25px;
    border-radius: 3px;
  }

  @media (max-width: 415px) {
    width: 90vw;
  }
`;

class SpotifyAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      birthMonth: 4,
      birthDate: 5,
      birthYear: 1998,
    };
  }

  componentWillMount = () => {
    cookies.set('birthMonth', this.state.birthMonth, { path: '/' });
    cookies.set('birthDate', this.state.birthDate, { path: '/' });
    cookies.set('birthYear', this.state.birthYear, { path: '/' });
  };

  handleBirthChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    cookies.set(e.target.name, e.target.value, { path: '/' });
  };

  render() {
    const { birthMonth, birthDate, birthYear } = this.state;
    return (
      <Container>
        <div className="auth-video-container"></div>
        <p>Select your birthdate and get your horoscope.</p>
        <div className="birthday-container">
          <input
            placeholder="Month"
            name="birthMonth"
            value={birthMonth}
            onChange={(e) => this.handleBirthChange(e)}
          />
          <input
            placeholder="Day"
            name="birthDate"
            value={birthDate}
            onChange={(e) => this.handleBirthChange(e)}
          />
          <input
            placeholder="Year"
            name="birthYear"
            value={birthYear}
            onChange={(e) => this.handleBirthChange(e)}
          />
        </div>
        <a href={`${this.props.serverUrl}/auth`}>Connect to Spotify</a>
      </Container>
    );
  }
}

export { SpotifyAuth };
