const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger_output.json');

require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;