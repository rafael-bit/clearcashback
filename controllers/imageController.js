const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Nenhuma imagem fornecida.' });
		}

		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{ format: 'auto' },
				(error, result) => {
					if (error) {
						return reject(error);
					}
					resolve(result);
				}
			).end(req.file.buffer);
		});

		res.status(200).json({ url: result.secure_url });
	} catch (error) {
		console.error('Erro ao fazer upload da imagem:', error);
		res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
	}
};