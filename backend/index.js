// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();

// const app = express();


// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true,
// }));


// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/github_oauth', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// app.use('/auth', authRoutes);

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });






const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import body-parser
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/github_oauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define User Schema
const UserSchema = new mongoose.Schema({
  githubId: String,
  accessToken: String,
  username: String
});

const User = mongoose.model('User', UserSchema);


const CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23liXVE5rpUyQpYS2d'; 
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'd84ab3ae906d1b6748fa9944f73c0de3236ba325'; 
const CALLBACK_URL = 'http://localhost:3000/oauth/callback';

// Middleware to parse JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GitHub OAuth</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2da44e;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <h1>GitHub OAuth Demo</h1>
        <a href="/login" class="button">Connect GitHub</a>
      </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${CALLBACK_URL}`;
  res.redirect(githubAuthUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: CALLBACK_URL
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const githubUser = userResponse.data;

    await User.findOneAndUpdate(
      { githubId: githubUser.id },
      {
        githubId: githubUser.id,
        username: githubUser.login,
        accessToken: accessToken
      },
      { upsert: true, new: true }
    );

    res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .success { color: #2da44e; }
          </style>
        </head>
        <body>
          <h1 class="success">Authentication Successful!</h1>
          <p>GitHub user ${githubUser.login} has been connected.</p>
          <p>The access token has been stored in the database.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error during GitHub OAuth:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .error { color: #d73a49; }
          </style>
        </head>
        <body>
          <h1 class="error">Authentication Error</h1>
          <p>An error occurred during authentication. Please try again.</p>
        </body>
      </html>
    `);
  }
});

app.post('/create-webhook', async (req, res) => {
  const { githubUsername, repoName } = req.body;

  try {
    
    const user = await User.findOne({ username: githubUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const webhookUrl = 'https://kind-tools-pump.loca.lt/webhook'; 
    const response = await axios.post(`https://api.github.com/repos/${githubUsername}/${repoName}/hooks`, {
      config: {
        url: webhookUrl,
        content_type: 'json',
        insecure_ssl: '0'
      },
      events: ['pull_request'],
      active: true
    }, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.json({
      message: 'Webhook created successfully',
      webhook: response.data
    });

  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

app.post('/webhook', (req, res) => {
  const event = req.headers['x-github-event'];
  
  if (event === 'pull_request') {
    const prData = req.body;
    console.log('Pull request event received:', prData);
    // You can add further processing of the pull request here
  }

  res.status(200).send('Webhook received');
});

// Debug endpoint to view stored users
app.get('/users', async (req, res) => {
  const users = await User.find({}, { _id: 0, __v: 0 });
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
