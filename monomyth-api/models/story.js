const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
  date: {type: Date, required: true},
  title: {type: String, required: true},
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  score: {type: Number, required: true},
  genres: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
}, {minimize: false})

module.exports = mongoose.model('Story', StorySchema);