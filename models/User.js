const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	image: String,
	expenses: {
		type: Number,
		default: 0
	},
	profit: {
		type: Number,
		default: 0
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
