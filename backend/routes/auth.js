const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();


const githubClientId = process.env.GITHUB_CLIENT_ID || 'Ov23liXVE5rpUyQpYS2d'; 
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || 'd84ab3ae906d1b6748fa9944f73c0de3236ba325';  
const frontendURL = 'http://localhost:5173'; 
const CALLBACK_URL = 'http://localhost:3000/auth/oauth/callback'; 

router.get('/login', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=repo&redirect_uri=${CALLBACK_URL}`;
  res.redirect(githubAuthUrl);
});







router.get('/oauth/callback', async (req, res) => {
  const { code } = req.query; 

  if (!code) {
    return res.redirect(`${frontendURL}?error=No code provided`); 
  }

  try {
 
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code: code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error('Failed to receive access token');
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userResponse.data;

    await User.findOneAndUpdate(
      { githubId: githubUser.id },
      {
        githubId: githubUser.id,
        username: githubUser.login,
        accessToken: accessToken,
      },
      { upsert: true, new: true }
    );

    
    res.redirect(`${frontendURL}?user=${encodeURIComponent(githubUser.login)}`);
  } catch (error) {
    console.error('Error during GitHub OAuth:', error);
    res.redirect(`${frontendURL}?error=${encodeURIComponent('Authentication failed')}`);
  }
});

module.exports = router;
