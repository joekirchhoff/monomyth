const async = require('async');
const Story = require('../models/story');
const { body,check,validationResult } = require('express-validator');

// STORIES --------------------------------------

exports.stories_get = (req, res, next) => {

  // console.log(req.user);

  // Extract URL query strings
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;
  const sortMethod = req.query.sort || 'score';
  const dateLimit = parseInt(req.query.date) || 31;

  // Calculate date filter cutoff
  const dateMin = new Date();
  dateMin.setDate(dateMin.getDate() - dateLimit);
  // If sortMethod is by 'new', no date limit applies
  if (sortMethod === 'date') {
    dateMin.setTime(0);
  }

  Story.find()
  .where({date: {$gte: dateMin}})
  .populate('author', '_id username')
  .sort(`-${sortMethod}`)
  .skip(page * limit)
  .limit(limit)
  .exec((err, stories) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(stories);
  })
}

exports.story_create = [

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Story title must be specified.'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Story text must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors);
      return;
    }
    else {
      // Data from form is valid.
      const story = new Story(
        {
          title: req.body.title,
          text: req.body.text,
          author: req.user,
          date: new Date(),
          likes: [],
          score: 0,
          genres: req.body.genres
        });
      story.save(function (err) {
        if (err) { return next(err); }
        res.status(200).json('Story posted successfully')
      });
    };
  }
]

// INDIVIDUAL STORY -----------------------------

exports.story_get = (req, res, next) => {

  Story.findById(req.params.storyID)
  .exec((err, story) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(story);
  })
}

exports.story_update = [

  // TODO: add user validation

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Story title must be specified.'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Story text must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors);
      return;
    }
    else {

      // Data from form is valid.
      const story = new Story(
        {
          title: req.body.title,
          text: req.body.text,
          genres: req.body.genres,
          _id: req.body.id
        });
      Story.findByIdAndUpdate(req.body.id, story, (err) => {
        if (err) { return next(err); }
        res.status(200).json('Update successful');
      })
    };
  }
]

exports.story_delete = (req, res, next) => {
  
  // TODO: add user validation

  Story.findByIdAndDelete(req.params.storyID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}

// STORY SEARCH ---------------------------------

exports.story_search = (req, res, next) => {

  // Extract URL query strings
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;
  const queryText = req.query.query || '';
  let field = req.query.field || 'title';

  // Sanitize query field to whitelisted options; default to 'title'
  if (field !== 'title' || field !== 'text') {
    field = 'title';
  }

  // Fuzzy search through Mongo aggregation pipeline
  Story.aggregate()
  .search({
    text: {
      path: field,
      query: queryText,
      fuzzy: {}
    }
  })
  .skip(page * limit)
  .limit(limit)
  .exec((err, stories) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(stories);
  })
}