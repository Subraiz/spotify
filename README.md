# Spotify Project

This project was generated using [Nx](https://nx.dev).

🔎 **Below is any documentation on which routes you will need to connect the Frontend to.**

_Alternatively you can look at the implementation of the routes https://documenter.getpostman.com/view/8127978/TVRedAP9_

### How to Authenticate

1. The first route you need access is to is /api/auth/, this will bring you to the Spotify website and ask you to login.

> IMPORTANT: You will get a CORS error if you try to make a get request to that route, instead simply make an a tag with `href="http://localhost:4000/api/auth"`.

2. Once the user logs in, the previous route will redirect back to our site, but notice that the url will have two queries in it. This is the access token and the refresh token. You should set refresh token as a cookie or save it in cache, since the access token expires in an hour, and using the refresh token we can easily get a new access token.

> The access token is linked with the user and certain permissions we have with the user's profile. Anytime we need to make changes to the account or read any information from the account we need to pass in the access token to Spotify.

3. In order to make sure we always have a valid access token (token that is not expired), each time the user refreshes the page, make a POST call to `/api/auth/refresh` and pass in the refresh token in the body as _refresh_token_

### Getting User Data

`GET /api/user` <br>
Pass in the access token as _access_token_ as a query parameter.

> This returns basic user information such as name, email, photo url, and country. Most importantly it gives us user_id as well so this should be set as a cookie or saved in cache.

### Playing With Playlists

`GET /api/playlist/sign`
Pass in _month_ _day_ _access_token_ as query parameters.

> This returns the zodiac sign of the user, playlist_id, playlist tracks, and other additoinal info associated with the zodiac sign. The tracks array is consisted of Spotify URIs which can be used with the frontend Web Playback SDK to play music. Docs for the SDK can be found at https://developer.spotify.com/documentation/web-playback-sdk/reference/.

`GET /api/playlist/save`
Pass in _user_id_ _playlist_id_ _access_token_ as the body.

> You can get user_id from `GET /api/user` and cache the user_id. You can get the playlist_id from `GET /api/playlist/sign`. You should have access_token from the OAuth step.
> This will save the playlist to a user's account. Anyone from TI's team can update the playlist and it will be refelected for all users.
