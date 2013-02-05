
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , tweet = require('./routes/tweet')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(process.env.SECRET || 'fake_secret'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect(process.env.MONGOLAB_URI || 'localhost');

  // session stuff
  app.use(express.cookieParser(process.env.SECRET || 'fake_secret'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// GETS
app.get('/', user.login_or_tweets);
app.get('/users', user.list);
app.get('/users/new', user.create);
app.get('/tweets', tweet.list);
app.get('/tweets/delete_all', tweet.delete_all);

// PUTS
app.post('/users/new', user.create_post);
app.post('/user/delete', user.index_delete);
app.post('/tweet/new', tweet.post_tweet);
app.post('/login', user.login_post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
