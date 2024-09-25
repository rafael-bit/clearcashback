require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const dbUser = process.env.DB_USER;
		const dbPassword = process.env.DB_PASSWORD;

		const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.vm6qsdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

		await mongoose.connect(uri);

		console.log('Banco de dados conectado com sucesso!');
	} catch (error) {
		console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
		process.exit(1); 
	}
};

module.exports = connectDB;
