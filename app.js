require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const port = 8080;
const app = express();

app.use(express.json());

const User = require('./models/User');

app.get('/', (req, res) => {
	res.status(200).json({ msg: 'teste' });
});

app.post('/auth/register', async (req, res) => {
	const { name, email, password, confirmPassword, imageProfile, expenses, profit } = req.body;
	if (!name) {
		return res.status(422).json({ msg: 'Name is mandatory' });
	} else if (!email) {
		return res.status(422).json({ msg: 'Email is mandatory' });
	} else if (!password) {
		return res.status(422).json({ msg: 'Password is mandatory' });
	} else if (password !== confirmPassword) {
		return res.status(422).json({ msg: "Passwords don't match" });
	}

	const userExists = await User.findOne({ email: email });

	if (userExists) {
		return res.status(422).json({ msg: "There is already one with that email" });
	}

	const salt = await bcrypt.genSalt(12);
	const passwordHash = await bcrypt.hash(password, salt);

	const user = new User({
		name,
		email,
		password: passwordHash
	});

	try {
		await user.save();
		res.status(201).json({ msg: 'User created successfully' });
	} catch (err) {
		res.status(500).json({ msg: 'Internal Error 500, try again later' });
	}
});

app.post("/auth/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		return res.status(422).json({ msg: 'Email is mandatory' });
	}
	if (!password) {
		return res.status(422).json({ msg: 'Password is mandatory' });
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ msg: 'Invalid password' });
		}

		try {
			const secret = process.env.SECRET;
			const token = jwt.sign(
				{
					id: user._id, 
				},
				secret
			);
			res.status(200).json({ msg: 'Login successfully!', token });
		} catch (err) {
			console.error("Error in auth/login:", err);
			res.status(500).json({ msg: "Internal Server Error 500" });
		}

	} catch (err) {
		console.error("Error in auth/login:", err);
		res.status(500).json({ msg: "Internal Server Error 500" });
	}
});

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.vm6qsdj.mongodb.net/clearclash?retryWrites=true&w=majority&appName=Cluster0`)
	.then(() => {
		app.listen(port, () => {
			console.log(`Servidor Rodando na porta: ${port}`);
		});
	})
	.catch((err) => console.log(err));
