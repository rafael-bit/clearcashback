const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);