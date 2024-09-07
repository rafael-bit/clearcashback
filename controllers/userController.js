const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	try {
		const { name, email, password, img } = req.body;

		if (!name || !email || !password || !img) {
			return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email já está em uso' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({ name, email, password: hashedPassword, img });
		await newUser.save();

		res.status(201).json({ message: 'Usuário criado com sucesso' });
	} catch (error) {
		console.error('Erro ao registrar usuário:', error);
		res.status(500).json({ message: 'Erro ao registrar usuário' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Credenciais inválidas' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Credenciais inválidas' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });

		res.status(200).json({ token });
	} catch (error) {
		console.error('Erro no login:', error);
		res.status(500).json({ message: 'Erro no login' });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);

	} catch (error) {
		console.error('Erro ao obter usuários:', error);
		res.status(500).json({ message: 'Erro ao obter usuários' });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error('Erro ao obter usuário:', error);
		res.status(500).json({ message: 'Erro ao obter usuário' });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { name, email, password, img } = req.body;
		const updates = {};

		if (name) updates.name = name;
		if (email) updates.email = email;
		if (img) updates.img = img;
		if (password) {
			updates.password = await bcrypt.hash(password, 10);
		}

		const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error);
		res.status(500).json({ message: 'Erro ao atualizar usuário' });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}

		res.status(200).json({ message: 'Usuário excluído com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir usuário:', error);
		res.status(500).json({ message: 'Erro ao excluir usuário' });
	}
};
