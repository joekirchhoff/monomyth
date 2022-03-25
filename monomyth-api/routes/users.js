var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
var User = require('../models/user');

const user_controller = require('../controllers/userController')

// JSON Parser Middleware
router.use(bodyParser.json());

// USERS ----------------------------------------

// POST new user
router.post('/', user_controller.user_create);

// SEARCH ---------------------------------------

// GET user search
router.get('/search', user_controller.user_search);

// SESSION --------------------------------------

// Login (POST new session)
router.post('/session', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) { console.log('auth error!') }
    req.logIn(user, function (err) { // <-- Log user in
      console.log('logIn called!')
      res.status(200).json({errors: false, user: user});
    });
  })(req, res, next);
});

// router.post('/session', passport.authenticate('local'), (req, res) => { console.log(req.user)});


// Logout (DELETE session)
router.delete('/session', (req, res) => {
  console.log(req.user);
  // req.logout();
  // req.session.destroy();
  // res.send({'message': 'Logout successful!'});
});

// USER -----------------------------------------

// GET user
router.get('/:userID', user_controller.user_get);

// UPDATE user
router.put('/:userID', user_controller.user_update);

// DELETE user
router.delete('/:userID', user_controller.user_delete);

module.exports = router;