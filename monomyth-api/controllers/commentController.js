const async = require('async');
const Comment = require('../models/comment');
const { body,check,validationResult } = require('express-validator');

// COMMENTS -------------------------------------

exports.comments_get = (req, res, next) => {

  // Extract URL query string
  const sortMethod = req.query.sort || 'score';

  Comment.find()
  .where({story: req.params.storyID})
  .sort(`-${sortMethod}`)
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

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors);
      return;
    }
    else {
      // Data from form is valid.
      const comment = new Comment(
        {
          text: req.body.text,
          author: req.user,
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

  // TODO: add user validation
  
  // Validate and sanitize fields.
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Comment text must be specified.'),

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
      const comment = new Comment(
        {
          text: req.body.text,
          _id: req.params.commentID
        });
      Comment.findByIdAndUpdate(req.params.commentID, comment, (err) => {
        if (err) { return next(err); }
        res.status(200).json('Update successful');
      })
    };
  }
]

exports.comment_delete = (req, res, next) => {

  // TODO: add user validation

  Comment.findByIdAndDelete(req.params.commentID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}