const Genre = require('../models/genre');

// GENRES ---------------------------------------

exports.genres_get = (req, res, next) => {

  Genre.find()
  .sort(`name`)
  .exec((err, genres) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json(genres);
  })
}