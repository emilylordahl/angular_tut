var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// --------------------------------
// SOME MIDDLEWARE SHIT
// --------------------------------

// Create a route for preloading post objects
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if (err) { return next(err); }
    if (!post) { return next(new Error("Cannot find that post.")); }

    req.post = post;
    return next();
  });
});

// Create a route for preloading comment objects
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error("Cannot find that comment.")); }

    req.comment = comment;
    return next();
  });
});

// --------------------------------
// END MIDDLEWARE
// --------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// POSTS INDEX
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    res.json(posts);
  });
});

// CREATE POST
router.post('/posts', function(req, res, next) {
  // This is happening from mongoose
  var post = new Post(req.body);
  post.save(function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
});

// SHOW A POST
// Because the post object was retrieved using the middleware function and attached to the req object, all our request handler has to do is return the JSON back to the client.
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(req.post);
  });
});

// UPDATE THE POST'S UPVOTES
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// UPDATE THE POST'S COMMENTS
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment) {
    if (err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});

// UPDATE THE POST'S COMMENTS UPVOTES
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


module.exports = router;
