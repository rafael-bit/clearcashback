const request = require('supertest');
const { app, startServer } = require('../index');
const mongoose = require('mongoose');

let server;

beforeAll(() => {
	server = startServer();
});

afterAll(async () => {
	await mongoose.connection.close();
	if (server) {
		server.close();
	}
});

describe('Testes para a API de usuários', () => {
	it('Deve registrar um novo usuário', async () => {
		const res = await request(app)
			.post('/api/users')
			.send({
				name: 'Usuário Teste',
				email: 'test@example.com',
				password: '12345678'
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('message', 'Usuário criado com sucesso');
	});

	it('Deve fazer login do usuário', async () => {
		const res = await request(app)
			.post('/api/users/login')
			.send({
				email: 'test@example.com',
				password: '12345678'
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Login bem-sucedido!');
		expect(res.body).toHaveProperty('token');
	});
});
