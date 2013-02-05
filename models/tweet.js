var mongoose = require('mongoose'), Schema = mongoose.Schema

var tweetSchema = new Schema({
	username: String, 
	text_body: String
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
