const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  date: {type: Date, required: true},
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  story: {type: Schema.Types.ObjectId, ref: 'Story'},
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  score: {type: Number, required: true},
})

module.exports = mongoose.model('Comment', CommentSchema);