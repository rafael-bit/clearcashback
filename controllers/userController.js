const { UserService } = require("../models/UserService");
const bcrypt = require('bcrypt');

const serviceController = {
	create: async (req, res) => {
		try {
			const existingUser = await UserService.findOne({ email: req.body.email });

			if (existingUser) {
				const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);

				if (isPasswordValid) {
					console.log('Login successful:', existingUser);
					return res.status(200).json({ msg: "Login successful" });
				} else {
					console.log('Invalid password for user:', existingUser.email);
					return res.status(401).json({ msg: "Invalid password" });
				}
			} else {
				const newUser = {
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					image: req.body.image,
				};

				const createdUser = await UserService.create(newUser);
				console.log('User created successfully:', createdUser);

				return res.status(201).json({ user: createdUser, msg: "User created successfully!" });
			}
		} catch (err) {
			console.error('Error during login or registration:', err);
			return res.status(500).json({ error: "Internal server error" });
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
			const existingUser = await UserService.findById(req.params.id);

			if (!existingUser) {
				return res.status(404).json({ status: 'User not found!' });
			}

			res.status(200).json({ status: 'User found!', user: existingUser });
		} catch (err) {
			console.error(err);
			if (err.name === 'CastError') {
				return res.status(400).json({ status: 'Invalid user ID!' });
			}
			res.status(500).json({ status: 'Internal server error' });
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
};

module.exports = serviceController;