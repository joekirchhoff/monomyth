const async = require('async');
const Story = require('../models/story');
const ObjectID = require('mongoose').Types.ObjectId;
const { body, validationResult } = require('express-validator');

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
        res.status(500).json({'error': err});
      } else {
        res.json(stories);
      }
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
        res.status(500).json({'error': err});
      } else {
        res.json(stories);
      }
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
        res.status(500).json({'error': err});
      } else {
        res.json(stories);
      }
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
        res.status(500).json({'error': err});
      } else {
        res.json(stories);
      }
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
        res.status(500).json({'error': err});
      } else {
        res.json(stories);
      }
    })
  }
}

exports.story_create = [

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Story title cannot be blank'),
  body('editorIsValid').equals('true').withMessage('Story text cannot be blank'),
  body('genres').custom((value, {req}) => {
    if (Array.isArray(value) && value.length === 3) {
      return true;
    } else {
      throw new Error('Please select exactly three genres');
    }
  }),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.status(400).json({'validationErrors': errors});
      return;
    } else if (!req.user) {
      // User not logged in; send error message
      res.status(401).json({'authError': 'Must be logged in to post story'});
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
    } else {
      res.json(story);
    }
  })
}

exports.story_update = [

  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Story title cannot be blank'),
  body('editorIsValid').equals('true').withMessage('Story text cannot be blank'),
  body('genres').custom((value, {req}) => {
    if (Array.isArray(value) && value.length === 3) {
      return true;
    } else {
      throw new Error('Please select exactly three genres');
    }
  }),

  // Process request after validation and sanitization.
  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({'validationError': errors})
    } else {
      // If not logged in, return error
      if (!req.user) {
        res.status(401).json({'authError': 'Must be logged in as author to update story'});
      } else {
        // User logged in, GET story to check author identity
        Story.findById(req.params.storyID, (err, story) => {
          if (err) return next(err);
  
          // Compare story author to request author
          if (story.author.valueOf() !== req.user.id) {
            // User is not the author, return error
            res.status(403).json({'authError': 'Must be logged in as author to update story'});
          } else {
            // User is logged in as author
            const newStory = new Story(
              {
                title: req.body.title,
                text: req.body.text,
                genres: req.body.genres,
                likes: [...story.likes],
                _id: req.params.storyID
              });
            Story.findByIdAndUpdate(req.params.storyID, newStory, (err) => {
              if (err) {
                res.status(400).json({'authError': 'Sorry, something went wrong while updating. Please try again later.'});
              } else {
                res.status(200).json('Update successful');
              }
            })
          }
        });
      }
    }
  }
]

exports.story_delete = (req, res, next) => {
  
  // User is not logged in at all; return error
  if (!req.user) {
    res.status(401).json({'error': 'Must be logged in as author to delete story'});
  } else {
    // User is logged in; check if user is author
    Story.findById(req.params.storyID, (err, story) => {
      if (err) return next(err);
      if (story.author.valueOf() !== req.user.id) {
        // User is not author; respond with error message
        res.status(403).json({'error': 'Must be logged in as author to delete story'});
      } else {
        // User is author; attempt delete
        Story.findByIdAndDelete(req.params.storyID, (err) => {
          if (err) { return next(err) };
          // Delete successful
          res.status(200).json('Delete successful')
        })
      }
    });
  }
}

// STORY LIKES ----------------------------------

exports.story_like = (req, res, next) => {

  if (!req.user) {
    // User not logged in, return error
    res.status(401).json({'error': 'Must be logged in to like story'});
  } else {
    // User logged in. Get story likes and score
    Story.findById(req.params.storyID)
    .select('likes score')
    .exec((err, story) => {
      if (err) {
        // Error retrieving story from database
        res.status(404).json({'error': 'Sorry, something went wrong on our end!'});
      } else {

        if (!story) {
          // Requested story not found in database
          res.status(400).json({'error': 'Story not found'});
        } else {

          // Check if user has already liked story
          const storyLikes = [...story.likes];
          let alreadyLiked = false;
          for (let i = 0; i < storyLikes.length; i++) {
            if (storyLikes[i].toString() === req.user.id) {
              alreadyLiked = true;
              break;
            };
          }
      
          if (alreadyLiked) {
            // User has already liked story, return error
            res.status(400).json({'error': 'User has already liked story'});
          } else {
            // Add user like from story, increment
            storyLikes.push(req.user._id);
      
            const storyScore = story.score + 1;
      
            const storyInfo = {
              likes: storyLikes,
              score: storyScore
            };
            Story.findByIdAndUpdate(req.params.storyID, storyInfo, (err) => {
              if (err) return next(err);
              res.status(200).json('Story like successful');
            })
          }
        }
      }
    })
  }
}

exports.story_unlike = (req, res, next) => {

  if (!req.user) {
    // User not logged in; throw error
    res.status(401).json({'error': 'Must be logged in to like story'});
  } else {

    // User logged in; get story likes and score
    Story.findById(req.params.storyID)
    .select('likes score')
    .exec((err, story) => {
      if (err) {
        // Error retrieving story from database
        res.status(404).json({'error': 'Sorry, something went wrong on our end!'});

      } else if (!story) {
          // Story not found in database
          res.status(400).json({'error': 'Story not found!'});

      } else {
        // Check if user has already liked story
        const storyLikes = [...story.likes];
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
          res.status(400).json({'error': 'User has not liked story'});
        } else {
          // User has liked story; remove user like from story, decrement
          storyLikes.splice(likedIndex, 1);
          const storyScore = story.score - 1;
    
          const storyInfo = {
            likes: storyLikes,
            score: storyScore
          };
          Story.findByIdAndUpdate(req.params.storyID, storyInfo, (err) => {
            if (err) return next(err);
            res.status(200).json('Story unlike successful');
          })
        }
      } 
    })
  }
}

// STORY SEARCH ---------------------------------

exports.story_search = (req, res, next) => {

  // Extract URL query strings
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;
  const queryText = req.query.query || '';
  let field = req.query.field || 'title';

  // Sanitize query field to whitelisted options; default to 'title'
  if (field !== 'title' && field !== 'text') {
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
  .lookup({ from: 'users', localField: 'author', foreignField: '_id', as: 'author' })
  .lookup({ from: 'genres', localField: 'genres', foreignField: '_id', as: 'genres' })
  .exec((err, stories) => {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.status(200).json(stories);
    }
  })
}