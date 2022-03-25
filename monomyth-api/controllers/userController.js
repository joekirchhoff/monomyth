const async = require('async');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body,check,validationResult } = require('express-validator');

// USER -----------------------------------------

exports.user_create = [

  // Validate and sanitize fields.
  body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.'),
  body('email').trim().isLength({ min: 1 }).escape().withMessage('Email must be specified.'),
  check('password').exists(),
  check('confirmPassword', 'Confirm Password field must have the same value as the Password field').exists().custom((value, { req }) => value === req.body.password),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors.array());
      return;
    }
    else {
      // Data from form is valid.
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
        user.save(function (err) {
          if (err) { return next(err); }
          // Successful
          res.status(200).json('Signup successful');
        });
      });
    }
  }
]

exports.user_get = (req, res, next) => {
  
  // MAJOR TODO: limit returned fields based on authentication

  User.findById(req.params.userID)
  .exec((err, user) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(user);
  })
}

exports.user_update = [

  // TODO: validate / sanitize links
  // TODO: user validation

  // Validate and sanitize fields.
  body('email').trim().isLength({ min: 1 }).escape().withMessage('Email must be specified.'),
  body('bio').trim().isLength({ max: 1000 }).escape().withMessage('Bio must not exceed 1000 characters.'),
  check('password').exists(),
  check('confirmPassword', 'Confirm Password field must have the same value as the Password field').exists().custom((value, { req }) => value === req.body.password),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.json(errors.array());
      return;
    }
    else {
      // Data from form is valid.
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err) {return next(err); }
        // otherwise, store hashedPassword in DB
        const user = new User(
          {
            email: req.body.email,
            password: hashedPassword,
            bio: req.body.bio,
            links: req.body.links,
          });
        User.findByIdAndUpdate(req.params.userID, user, (err) => {
          if (err) {return next(err); }
          // Successful
          res.status(200).json('User update successful');
        })
      });
    }
  }
]

exports.user_delete = (req, res, next) => {

  // TODO: user validation

  User.findByIdAndDelete(req.params.userID, (err) => {
    if (err) { return next(err) };
    // Delete successful
    res.status(200).json('Delete successful')
  })
}

// USER SEARCH ----------------------------------

exports.user_search = (req, res, next) => {

  // MAJOR TODO: user authentication, limit sensitive outputted fields (email and password) to account owner

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