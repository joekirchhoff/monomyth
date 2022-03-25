const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  color: {type: String, required: true}
})

module.exports = mongoose.model('Genre', GenreSchema);