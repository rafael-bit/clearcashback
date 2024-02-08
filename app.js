const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

const conn = require("./db/conn");
conn().then(() => {
	app.use(cors());
	app.use(express.json());

	// Rotas
	const routes = require("./routes/router");
	app.use("/api", routes);

	app.listen(port, () => {
		console.log(`Servidor Rodando na porta: ${port}`);
	});
});
