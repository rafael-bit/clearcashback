const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
	try {
		const { userId, amount, category, date, description } = req.body;

		const newTransaction = new Transaction({
			userId,
			amount,
			category,
			date,
			description,
		});

		await newTransaction.save();

		res.status(201).json({ message: 'Transação criada com sucesso', transaction: newTransaction });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
	}
};

exports.getAllTransactions = async (req, res) => {
	try {
		const userId = req.params.userId;

		const transactions = await Transaction.find({ userId });

		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao obter transações', error: error.message });
	}
};

exports.updateTransaction = async (req, res) => {
	try {
		const transactionId = req.params.id;
		const { amount, category, date, description } = req.body;

		const updatedTransaction = await Transaction.findByIdAndUpdate(
			transactionId,
			{ amount, category, date, description },
			{ new: true }
		);

		if (!updatedTransaction) {
			return res.status(404).json({ message: 'Transação não encontrada' });
		}

		res.status(200).json({ message: 'Transação atualizada com sucesso', transaction: updatedTransaction });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
	}
};

exports.deleteTransaction = async (req, res) => {
	try {
		const transactionId = req.params.id;

		const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

		if (!deletedTransaction) {
			return res.status(404).json({ message: 'Transação não encontrada' });
		}

		res.status(200).json({ message: 'Transação excluída com sucesso' });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao excluir transação', error: error.message });
	}
};