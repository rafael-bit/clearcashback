const { UserService } = require("../models/UserService");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const serviceController = {
	create: async (req, res) => {
		try {
			const existingUser = await UserService.findOne({ email: req.body.email });

			if (existingUser) {
				return res.status(400).json({ error: "User with this email already exists!" });
			}

			const service = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				image: req.body.image,
			};

			const response = await UserService.create(service);
			res.status(201).json({ response, msg: "Created successfully!" });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	getAll: async (req, res) => {
		try {
			const services = await UserService.find();
			res.json(services);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Error retrieving all services" });
		}
	},

	get: async (req, res) => {
		try {
			const email = req.body.email;
			const password = req.body.password;

			const user = await UserService.findOne({ email: email });

			if (!user) {
				return res.status(404).json({ msg: 'User not found!' });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return res.status(401).json({ msg: 'Invalid credentials. Please try again.' });
			}

			res.json({ user, msg: 'User authenticated successfully!' });
		} catch (err) {
			console.error(err);
			if (err.name === 'CastError') {
				return res.status(400).json({ msg: 'Invalid user ID!' });
			}
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	delete: async (req, res) => {
		try {
			const id = req.params.id;
			const service = await UserService.findById(id);

			if (!service) {
				return res.status(404).json({ msg: "User not found!" });
			}

			const deletedService = await UserService.findByIdAndDelete(id);
			res.status(200).json({ deletedService, msg: "User deleted!" });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
			res.status(401).json({ msg: 'Authentication failed' });
		}
	},

	put: async (req, res) => {
		try {
			const id = req.params.id;
			const updateData = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				image: req.body.image,
				money: req.body.money,
				expenses: req.body.d,
				investments: req.body.investments,
			};

			const updatedService = await UserService.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedService) {
				return res.status(404).json({ msg: "User not found for update!" });
			}

			res.json({ updatedService, msg: "User updated successfully!" });
		} catch (err) {
			console.error(err);
			if (err.name === 'CastError') {
				return res.status(400).json({ msg: "Invalid user ID!" });
			}
			res.status(500).json({ error: "Internal server error" });
		}
	},

	login: async (req, res) => {
		try {
			const email = req.body.email;
			const password = req.body.password;

			const user = await UserService.findOne({ email: email });

			if (!user) {
				return res.status(404).json({ msg: "User not found" });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return res.status(401).json({msg: "Invalid credentials. Please try again." });
			}
			const token = jwt.sign({ userId: user._id }, '112630967543423946513122934650', { expiresIn: '1h' });

			res.json({user, token, msg: "User authenticated successfully!" });
		} catch (err) {
			console.error(err);
			if (err.name === 'CastError') {
				return res.status(400).json({msg: "Invalid user ID!" });
			}
			res.status(500).json({ error: 'Intern Error Server' });
		}
	},
};

module.exports = serviceController;