const mongoose = require("mongoose");

const { Schema } = mongoose;

const serviceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: false,
	},
	money: {
		type: parseFloat,
		required: false,
	},
	expenses: {
		type: String,
		required: false,
	},
	investments: {
		type: flo,
		required: false
	}
}, { timestamps: true });

const UserService = mongoose.model("UserService", serviceSchema);

module.exports = {
	UserService,
	serviceSchema
};