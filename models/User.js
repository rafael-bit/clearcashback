const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	image: String,
	expenses: Number,
	profit: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;