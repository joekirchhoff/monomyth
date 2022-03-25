const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  date: {type: Date, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  bio: {type: String},
  links: [{type: String}],
})

module.exports = mongoose.model('User', UserSchema);