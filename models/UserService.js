const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
		type: Number,
		required: false,
	},
	expenses: {
		type: String,
		required: false,
	},
	investments: {
		type: Number,
		required: false,
	},
}, { timestamps: true });

serviceSchema.pre("save", async function (next) {
	try {
		if (this.isModified("password") || this.isNew) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
		return next();
	} catch (error) {
		return next(error);
	}
});

const UserService = mongoose.model("UserService", serviceSchema);

module.exports = {
	UserService,
	serviceSchema,
};
