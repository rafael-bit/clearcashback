const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		if (!req.user) {
			throw new Error('Usuário não encontrado');
		}
		next();
	} catch (err) {
		res.status(401).json({ message: 'Token inválido.' });
	}
};

module.exports = authMiddleware;