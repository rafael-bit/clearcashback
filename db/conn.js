const mongoose = require("mongoose")

async function main() {
	try {
		await mongoose.connect(
			"mongodb+srv://clearcash:2opSsVBKMCbMi6MS@cluster0.vm6qsdj.mongodb.net/?retryWrites=true&w=majority"
		)
		console.log("conectado")
	} catch (err) {
		console.log(err)
	}
}

module.exports = main