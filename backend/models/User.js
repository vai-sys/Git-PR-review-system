const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  githubId: String,
  accessToken: String,
  username: String
});
module.exports = mongoose.model('User', UserSchema);
