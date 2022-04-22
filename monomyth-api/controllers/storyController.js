const async = require('async');
const Story = require('../models/story');
const ObjectID = require('mongoose').Types.ObjectId;
const { body,check,validationResult } = require('express-validator');

// STORIES --------------------------------------

exports.stories_get = (req, res, next) => {

  // Extract URL query strings
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;
  const sortMethod = req.query.sort || 'score';
  const dateLimit = parseInt(req.query.date) || 0;
  const author = req.query.author || '';

  // Calculate date filter cutoff
  const dateMin = new Date();
  dateMin.setDate(dateMin.getDate() - dateLimit);
  // If sortMethod is by 'new' or 'all time score', no date limit applies
  if (sortMethod === 'date' || dateLimit === 0) {
    dateMin.setTime(0);
  }

  // Get genre filters; query determined by number of genre parameters
  const firstGenre = (req.query.firstGenre) ? new ObjectID(req.query.firstGenre) : null;
  const secondGenre = (req.query.secondGenre) ? new ObjectID(req.query.secondGenre) : null;
  const thirdGenre = (req.query.thirdGenre) ? new ObjectID(req.query.thirdGenre) : null;

  if (author) { // Filter by author; excludes genre filters, used for user profile bibliography
    Story.find()
    .where({author: new ObjectID(author)})
    .populate('author', '_id username')
    .populate('genres')
    .sort(`-${sortMethod}`)
    .exec((err, stories) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json(stories);
    })
  } else if (firstGenre && secondGenre && thirdGenre) { // Three genre filters specified
    Story.find()
    .where({date: {$gte: dateMin}})
    .where('genres')
    .all([firstGenre, secondGenre, thirdGenre])
    .populate('author', '_id username')
    .populate('genres')
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
  } else if (firstGenre && secondGenre) { // Two genre filters specified
    Story.find()
    .where({date: {$gte: dateMin}})
    .where('genres')
    .all([firstGenre, secondGenre])
    .populate('author', '_id username')
    .populate('genres')
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
  } else if (firstGenre) { // One genre filter specified
    Story.find()
    .where({date: {$gte: dateMin}})
    .where({genres: firstGenre})
    .populate('author', '_id username')
    .populate('genres')
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
  } else { // Default: no genre filtering
    Story.find()
    .where({date: {$gte: dateMin}})
    .populate('author', '_id username')
    .populate('genres')
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
      // There are errors.
      res.json(errors);
      return;
    } else if (!req.user) {
      // User not logged in; send error message
      res.status(401).json({'message': 'Must be logged in to post story'});
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
      story.save()
      .then(savedStory => { // Successful save; respond with new story ID
        res.status(200).json(savedStory._id);
      })
    };
  }
]

// INDIVIDUAL STORY -----------------------------

exports.story_get = (req, res, next) => {

  Story.findById(req.params.storyID)
  .populate('author', '_id username')
  .populate('genres')
  .exec((err, story) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(story);
  })
}

exports.story_update = [

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Story title must be specified.'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Story text must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // If not logged in, return error
    if (!req.user) {
      res.status(401).json('message', 'Must be logged in as author to update story');
    }
    
    // If logged in but not as author, return error
    Story.findById(req.params.storyID, (err, story) => {
      if (err) res.json(err);
      if (story.author !== req.user.id) {
        res.status(403).json('message', 'Must be logged in as author to update story');
      }
    });

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
          _id: req.params.storyID
        });
      Story.findByIdAndUpdate(req.params.storyID, story, (err) => {
        if (err) { return next(err); }
        res.status(200).json('Update successful');
      })
    };
  }
]

exports.story_delete = (req, res, next) => {
  
  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in as author to delete story');
  }
  
  // If logged in but not as author, return error
  Story.findById(req.params.storyID, (err, story) => {
    if (err) res.json(err);
    if (story.author !== req.user.id) {
      res.status(403).json('message', 'Must be logged in as author to delete story');
    }
  });

  Story.findByIdAndDelete(req.params.storyID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}

// STORY LIKES ----------------------------------

exports.story_like = (req, res, next) => {

  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in to like story');
  }

  // Get story likes
  Story.findById(req.params.storyID)
  .select('likes score')
  .exec((err, story) => {
    if (err) return next(err);

    if (!story) {
      res.status(400).json('message', 'Story not found!');
    }

    const storyLikes = [...story.likes];

    // Check if user has already liked story
    let alreadyLiked = false;
    for (let i = 0; i < storyLikes.length; i++) {
      if (storyLikes[i].toString() === req.user.id) {
        alreadyLiked = true;
        break;
      };
    }

    if (alreadyLiked) {
      // User has already liked story, return error
      res.status(400).json('User has already liked story');
    } else {
      // Add user like from story, increment
      storyLikes.push(req.user._id);

      const storyScore = story.score + 1;

      const storyInfo = {
        likes: storyLikes,
        score: storyScore
      };
      console.log('Story info: ', storyInfo);
      Story.findByIdAndUpdate(req.params.storyID, storyInfo, (err) => {
        if (err) return next(err);
        res.status(200).json('Story like successful');
      })
    }
  })
}

exports.story_unlike = (req, res, next) => {

  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in to like story');
  }

  // Get story likes
  Story.findById(req.params.storyID)
  .select('likes score')
  .exec((err, story) => {
    if (err) return next(err);

    if (!story) {
      res.status(400).json('message', 'Story not found!');
    }

    const storyLikes = [...story.likes];

    // Check if user has already liked story
    let alreadyLiked = false;
    let likedIndex = -1;
    for (let i = 0; i < storyLikes.length; i++) {
      if (storyLikes[i].toString() === req.user.id) {
        alreadyLiked = true;
        likedIndex = i;
        break;
      };
    }

    if (!alreadyLiked) {
      // User has not already liked story, return error
      res.status(400).json('User has not liked story');
    } else {
      // Remove user like from story, decrement
      storyLikes.splice(likedIndex, 1);

      const storyScore = story.score - 1;

      const storyInfo = {
        likes: storyLikes,
        score: storyScore
      };
      console.log('Story info: ', storyInfo);
      Story.findByIdAndUpdate(req.params.storyID, storyInfo, (err) => {
        if (err) return next(err);
        res.status(200).json('Story unlike successful');
      })
    }
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