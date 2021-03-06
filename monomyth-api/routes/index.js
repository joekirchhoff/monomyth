var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

const story_controller = require('../controllers/storyController')
const comment_controller = require('../controllers/commentController')
const genre_controller = require('../controllers/genreController')

// JSON Parser Middleware
router.use(bodyParser.json());

// CORS
router.use(cors({
  'origin' : process.env.CLIENT_URL,
  'methods': "GET,POST,PUT,DELETE, PATCH",
  'credentials': true,
}))

// STORIES --------------------------------------

// GET all stories
router.get('/stories', story_controller.stories_get);

// POST new story
router.post('/stories', story_controller.story_create);

// SEARCH ---------------------------------------

// GET story search
router.get('/stories/search', story_controller.story_search);

// STORY ----------------------------------------

// GET story
router.get('/stories/:storyID', story_controller.story_get);

// UPDATE story
router.put('/stories/:storyID', story_controller.story_update);

// DELETE story
router.delete('/stories/:storyID', story_controller.story_delete);

// (POST) Like story
router.post('/stories/:storyID/likes', story_controller.story_like);

// (DELETE) Unlike story
router.delete('/stories/:storyID/likes', story_controller.story_unlike);

// COMMENTS -------------------------------------

// GET all comments on story
router.get('/stories/:storyID/comments', comment_controller.comments_get);

// POST new comment on story
router.post('/stories/:storyID/comments', comment_controller.comment_create);

// COMMENT --------------------------------------

// GET comment
router.get('/stories/:storyID/comments/:commentID', comment_controller.comment_get);

// UPDATE comment
router.put('/stories/:storyID/comments/:commentID', comment_controller.comment_update);

// DELETE story
router.delete('/stories/:storyID/comments/:commentID', comment_controller.comment_delete);

// (POST) Like comment
router.post('/stories/:storyID/comments/:commentID/likes', comment_controller.comment_like);

// (DELETE) Unlike comment
router.delete('/stories/:storyID/comments/:commentID/likes', comment_controller.comment_unlike);

// GENRES ---------------------------------------

// GET all genres
router.get('/genres', genre_controller.genres_get);


module.exports = router;
