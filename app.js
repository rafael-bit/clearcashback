const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');
const authMiddleware = require('./middlewares/auth');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
