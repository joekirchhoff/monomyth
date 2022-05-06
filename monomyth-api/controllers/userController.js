const async = require('async');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body,check,validationResult } = require('express-validator');
const passport = require('passport');

// USER -----------------------------------------

exports.user_create = [

  // Validate and sanitize fields.
  body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.'),
  body('email').trim().isLength({ min: 1 }).escape().withMessage('Email must be specified.'),
  check('password').isLength({ min: 5 }).escape().withMessage('Password must contain at least 5 characters'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors; return array of errors
      res.status(400).json({'validateErrors': errors.array()});
      return;
    }
    else {
      // Data from form is valid. Check if username and email are unique.
      async.parallel([
        function(cb) { User.findOne({ email: req.body.email }, cb) },
        function(cb) { User.findOne({ username: req.body.username }, cb) }
      ], function(err, result) {
        if (err) return next(err);
        if (result[0]) {
          res.status(400).json({'duplicationError' : 'An account with that email already exists'})
          return;
        }
        else if (result[1]) {
          res.status(400).json({'duplicationError' : 'An account with that username already exists'})
          return;
        }
        else {
          // Username and email are unique, create account
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            // if err, do something
            if (err) {return next(err); }
            // otherwise, store hashedPassword in DB
            const user = new User(
              {
                date: new Date(),
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                bio: '',
                links: [],
              });
            user.save(function (err, user) {
              if (err) { return next(err); }
              // User created successfully; attempt automatic log in
              req.login(user, function(err) {
                if (err) { return next(err); }
                // Log in successful
                res.status(200).json({user: user});
              });
            });
          });
        }
      })
    };
  }   
]

exports.user_get = (req, res, next) => {

  // User is logged in as target user; expose all data fields
  if (req.user && req.params.userID == req.user.id) {
    User.findById(req.params.userID)
    .exec((err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json(user);
    })
  }
  // User is not target user; limit data exposed
  else {
    User.findById(req.params.userID)
    .select('-email -password')
    .exec((err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json(user);
    })
  }  
}

exports.user_update = [

  // TODO: validate / sanitize links
  // TODO: optional update fields

  // Validate and sanitize fields.
  // body('email').trim().isLength({ min: 1 }).escape().withMessage('Email must be specified.'),
  body('bio').trim().isLength({ max: 1000 }).escape().withMessage('Bio must not exceed 1000 characters.'),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // If not logged in, return error
    if (!req.user) {
      res.status(401).json('message', 'Must be logged in to update user');
    }

    // If logged in but not as target user, return error
    if (req.user.id !== req.params.userID) {
      res.status(403).json('message', 'Must be logged in as this user to update');
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors.array());
      return;
    }
    else {
      // Data from form is valid.
      const user = new User(
        {
          bio: req.body.bio,
          links: req.body.links,
          _id: req.params.userID
        });
      User.findByIdAndUpdate(req.params.userID, user, (err) => {
        if (err) {
          res.status(400).json({'message': err})
        } else {
          // Successful
          res.status(200).json('User update successful');
        }
      })
    }
  }
]

exports.user_delete = (req, res, next) => {

  // If not logged in, return error
  if (!req.user) {
    res.status(401).json('message', 'Must be logged in to delete user');
  }
  
  // If logged in but not as target user, return error
  if (req.user.id !== req.params.userID) {
    res.status(403).json('message', 'Must be logged in as this user to delete');
  }

  User.findByIdAndDelete(req.params.userID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}

// USER SEARCH ----------------------------------

exports.user_search = (req, res, next) => {

  // Extract URL query strings
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;
  const queryText = req.query.query || '';

  // Fuzzy search through Mongo aggregation pipeline
  User.aggregate()
  .search({
    text: {
      path: 'username',
      query: queryText,
      fuzzy: {}
    }
  })
  .project('-email -password')
  .skip(page * limit)
  .limit(limit)
  .exec((err, users) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(users);
  })
}