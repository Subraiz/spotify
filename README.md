# Spotify Project

This project was generated using [Nx](https://nx.dev).

🔎 **Below is any documentation on which routes you will need to connect the Frontend to.**

### How to Authenticate

1. The first route you need access is to is /api/auth/, this will bring you to the Spotify website and ask you to login.

> IMPORTANT: You will get a CORS error if you try to make a get request to that route, instead simply make an a tag with `href="http://localhost:4000/api/auth"`.

2. Once the user logs in, the previous route will redirect back to our site, but notice that the url will have two queries in it. This is the access token and the refresh token. You should set refresh token as a cookie or save it in cache, since the access token expires in an hour, and using the refresh token we can easily get a new access token.

> The access token is linked with the user and certain permissions we have with the user's profile. Anytime we need to make changes to the account or read any information from the account we need to pass in the access token to Spotify.

3. In order to make sure we always have a valid access token (token that is not expired), each time the user refreshes the page, make a POST call to `/api/auth/refresh` and pass in the refresh token in the body as _refresh_token_

### Getting User Data

`GET /api/user` <br>
Pass in the access token as _access_token_ as a query parameter.

> This returns basic user information such as name, email, photo url, and country.

### Playing With Playlists

`In Progress`
