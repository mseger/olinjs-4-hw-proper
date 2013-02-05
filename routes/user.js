var User = require('../models/user')
/*
 * GET users listing.
 */

exports.list = function(req, res){
  // get all existend users from db
  var users = User.find({}).exec(function (err, docs){
  	if (err)
  		return console.log("Couldn't get users.");
  	res.render('users', {users: docs, title: 'Twitter Users'});
  });
};

// create a new user, based on user input
exports.create = function(req, res){
	res.render('new_user', {title: 'Create a new profile'});
};

// post new user info
exports.create_post = function(req, res){
	// post action for the newly created user

	// save if this user doesn't currently exist
	// CASE 1: the login field is filled-in 
	if(req.body.username != null){
		var curr_user = new User({name: req.body.username});
		curr_user.save(function (err){
			if(err)
				return console.log("Couldn't log in current user");
			req.session.user = curr_user;
			res.redirect('/tweets');
		});
	}else{
		if(User.findOne({name: req.body.name})!== undefined){
			// save the new User
			var newUser = new User({name: req.body.name});
			newUser.save(function (err){
				if(err)
					console.log("Unable to save user.");
				})
				req.session.user = newUser;
				res.redirect('/tweets');
		}else{
			// otherwise, user exists, log it (PUT A POP-UP IN HERE)
			console.log("Sorry, that username has been taken.");
		};
	}
};

// remove an individual user
exports.index_delete = function(req, res){
	var users = User.findOneAndRemove({_id: req.body.id}).exec(function (err, docs){
		if (err)
			return console.log("can't remove user")
		res.redirect('/users');
	});
};

// log-in to account
exports.login_or_tweets = function(req, res){
	if(!req.session.user){
		// the user isn't logged into a session, need to log them in
		// start a user session on login
		res.redirect('/users/new');	
	}else{
		console.log("we have you as already logged in");
		res.redirect('/tweets');
	}
};

// post log-in credentials
exports.login_post = function(req, res){
	var curr_user = new User({name: req.body.username});
	curr_user.save(function (err){
		if(err)
			return console.log("Couldn't log in current user");
		req.session.user = curr_user;
	});
}







