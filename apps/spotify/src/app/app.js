import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';

const StyledApp = styled.div`
  font-family: sans-serif;
  min-width: 300px;
  max-width: 600px;
  margin: 50px auto;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      userId: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  componentWillMount = async () => {
    let urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (userId !== null && accessToken !== null && refreshToken !== null) {
      this.setState({ authenticated: true, userId, accessToken, refreshToken });
    }
  };

  render() {
    const { authenticated, userId } = this.state;
    if (!authenticated) {
      return (
        <StyledApp>
          <a href={'http://localhost:4000/api/auth'}>Login with spotify!</a>
        </StyledApp>
      );
    } else {
      return (
        <StyledApp>
          <p>Hello user {userId}</p>
        </StyledApp>
      );
    }
  }
}
export default App;
