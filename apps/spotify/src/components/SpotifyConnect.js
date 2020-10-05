import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20vw;

  img {
    object-fit: cover;
    width: 100%;
    height: 50vh;
    border-radius: 15px;
  }

  p {
    font-family: Montserrat;
  }

  .birthday-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  input {
    width: 30%;
    background-color: grey;
    border-radius: 15px;
    border: 0px solid black;
  }

  a {
    padding: 10px 25px;
    background-color: grey;
    color: white;
    font-faimly: Montserrat;
    text-align: center;
    margin-top: 25px;
    border-radius: 15px;
  }
`;

class SpotifyConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { month, day, year } = this.props;
    return (
      <Container>
        <img
          src={
            'https://storage.googleapis.com/afs-prod/media/media:6a4aed11404f49ac868949c91f6de54a/3000.jpeg'
          }
        />
        <p>
          Enter your birthdate to get your zodiac sign and connect to Spotify to
          get your reading and playlist.
        </p>
        <div className="birthday-container">
          <input
            placeholder="Month"
            name="birthMonth"
            value={month}
            onChange={(e) => this.props.handleInputChange(e)}
          />
          <input
            placeholder="Day"
            name="birthDate"
            value={day}
            onChange={(e) => this.props.handleInputChange(e)}
          />
          <input
            placeholder="Year"
            name="birthYear"
            value={year}
            onChange={(e) => this.props.handleInputChange(e)}
          />
        </div>
        <a href={`${this.props.serverUrl}/auth`}>Connect to Spotify</a>
      </Container>
    );
  }
}

export { SpotifyConnect };
