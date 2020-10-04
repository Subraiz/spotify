const UserRouter = require('express').Router();
const { User } = require('../../controllers');
const axios = require('axios');

UserRouter.get('/', async (req, res) => {
  let access_token = req.query.access_token;
  const user = await User.getUser(access_token, res);

  return res.status(200).send(user);
});

module.exports = UserRouter;
