require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const User = require('./models/User');

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Welcome to the application!' });
});

app.get("/user/:id", checkToken, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

function checkToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Access denied' });
	}

	try {
		const secret = process.env.SECRET;
		jwt.verify(token, secret);
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ error: 'Invalid token' });
	}
}

app.post('/auth/register', async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		if (!name || !email || !password || password !== confirmPassword) {
			return res.status(422).json({ error: 'Invalid input data' });
		}

		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(422).json({ error: 'User with this email already exists' });
		}

		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: passwordHash,
		});

		await newUser.save();
		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post("/auth/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(422).json({ error: 'Invalid input data' });
		}

		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const secret = process.env.SECRET;

		if (!secret) {
			return res.status(500).json({ error: 'Internal Server Error - Missing JWT secret' });
		}

		const token = jwt.sign({ id: user._id }, secret);
		res.status(200).json({ message: 'Login successful!', token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vm6qsdj.mongodb.net/clearclash?retryWrites=true&w=majority&appName=Cluster0`
)
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on port: ${port}`);
		});
	})
	.catch((err) => console.error('Database connection error:', err));