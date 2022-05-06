const async = require('async');
const Comment = require('../models/comment');
const { body,validationResult } = require('express-validator');

// COMMENTS -------------------------------------

exports.comments_get = (req, res, next) => {

  // Extract URL query string
  const sortMethod = req.query.sort || 'score';

  Comment.find()
  .where({story: req.params.storyID})
  .sort(`-${sortMethod}`)
  .populate('author', 'username _id')
  .exec((err, comments) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(comments);
  })
}

exports.comment_create = [

  // Validate and sanitize fields.
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Comment text must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // If not logged in, return error
    if (!req.user) {
      res.status(401).json({'authError': 'Must be logged in to comment'});
    } else if (!errors.isEmpty()) {
      // Validation error; return error message object
      res.status(400).json({'validationError': errors[0] });
      return;
    } else {
      // Data from form is valid.
      const comment = new Comment(
        {
          text: req.body.text,
          author: req.user.id,
          date: new Date(),
          likes: [],
          score: 0,
          story: req.params.storyID
        });
      comment.save(function (err) {
        if (err) { return next(err); }
        res.status(200).json('Comment posted successfully')
      });
    };
  }
]

// COMMENT --------------------------------------

exports.comment_get = (req, res, next) => {

  Comment.findById(req.params.commentID)
  .exec((err, comment) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(comment);
  })
}

exports.comment_update = [
  
  // Validate and sanitize fields.
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Comment text must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    if (!req.user) {
      // User is not logged in; send error message
      res.status(401).json({'error': 'Must be logged in to update comment'});
    }
    else {
      // User is logged in; check if user is author
      Comment.findById(req.params.commentID, (err, comment) => {
        if (err) {
          res.status(404).json({'error': 'Something went wrong on our end!'});
        }
        else if (comment.author.valueOf() !== req.user.id) {

          // User is logged in but not as author
          res.status(403).json({'error': 'Must be logged in as comment author to update'});

        } else { // User is logged in as author, continue
          
          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            // Validation error. Return error message
            res.status(400).json({'error': errors[0]});
          }
          else {
            // Data from form is valid.
            const newComment = new Comment(
              {
                text: req.body.text,
                likes: [...comment.likes],
                _id: req.params.commentID
              });
            Comment.findByIdAndUpdate(req.params.commentID, newComment, (err) => {
              if (err) { return next(err); }
              res.status(200).json('Update successful');
            })
          };
        }
        }
      );
    }
    
  }
]

exports.comment_delete = (req, res, next) => {

  // User not logged in; respond with error
  if (!req.user) {
    res.status(401).json({'message': 'Must be logged in to delete comment'});
    return next();
  }
  
  // User logged in; check if user is comment author
  Comment.findById(req.params.commentID, (err, comment) => {
    if (err) {
      res.json(err);
      return next();
    }
    if (comment.author.valueOf() !== req.user.id) {
      // User logged in but not comment author
      res.status(403).json({'message': 'Must be logged in as comment author to delete'});
      return next();
    }
  });

  Comment.findByIdAndDelete(req.params.commentID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}

// COMMENT LIKES --------------------------------

exports.comment_like = (req, res, next) => {

  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in to like comment');
  } else {
    // Get comment likes
    Comment.findById(req.params.commentID)
    .select('likes score')
    .exec((err, comment) => {
      if (err) return next(err);

      const commentLikes = [...comment.likes];

      // Check if user has already liked comment
      let alreadyLiked = false;
      for (let i = 0; i < commentLikes.length; i++) {
        if (commentLikes[i].toString() === req.user.id) {
          alreadyLiked = true;
          break;
        };
      }

      if (alreadyLiked) {
        // User has already liked comment, return error
        res.status(400).json('User has already liked comment');
      } else {
        // Add user like from comment, increment
        commentLikes.push(req.user._id);
        const commentScore = comment.score + 1;

        const commentInfo = {
          likes: commentLikes,
          score: commentScore
        };
        Comment.findByIdAndUpdate(req.params.commentID, commentInfo, (err) => {
          if (err) return next(err);
          res.status(200).json('Comment like successful');
        })
      }
    })
  }

  
}

exports.comment_unlike = (req, res, next) => {

  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in to like comment');
  } else {
    // Get comment likes
    Comment.findById(req.params.commentID)
    .select('likes score')
    .exec((err, comment) => {
      if (err) return next(err);

      const commentLikes = [...comment.likes];

      // Check if user has already liked comment
      let alreadyLiked = false;
      let likedIndex = -1;
      for (let i = 0; i < commentLikes.length; i++) {
        if (commentLikes[i].toString() === req.user.id) {
          alreadyLiked = true;
          likedIndex = i;
          break;
        };
      }

      if (!alreadyLiked) {
        // User has not already liked comment, return error
        res.status(400).json('User has already liked comment');
      } else {
        // Add user like to comment, decrement
        commentLikes.splice(likedIndex, 1);
        const commentScore = comment.score - 1;

        const commentInfo = {
          likes: commentLikes,
          score: commentScore
        };
        console.log('Comment info: ', commentInfo);
        Comment.findByIdAndUpdate(req.params.commentID, commentInfo, (err) => {
          if (err) return next(err);
          res.status(200).json('Comment unlike successful');
        })
      }
    })
  }

  
}