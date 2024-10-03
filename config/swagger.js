const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'API de Exemplo',
		description: 'Descrição da API',
	},
	host: 'localhost:8080',
	schemes: ['http'],
};

const outputFile = './config/swagger_output.json';
const endpointsFiles = ['../index.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
	require('../index');
});
