const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const Joi = require('joi');

exports.createTransaction = async (req, res) => {
	const schema = Joi.object({
		userId: Joi.string().required(),
		amount: Joi.number().required(),
		category: Joi.string().required(),
		date: Joi.date().required(),
		description: Joi.string().optional(),
	});
	res.status(201).json({ message: 'Transação criada com sucesso', transaction: newTransaction });
	if (error) {
		res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
	}
}

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

exports.getFinancialReport = async (req, res) => {
	try {
		const userId = req.params.userId;

		const transactions = await Transaction.find({ userId });

		let totalIncome = 0;
		let totalExpense = 0;
		const monthlyIncome = {};
		const monthlyExpense = {};

		transactions.forEach(transaction => {
			const amount = transaction.amount;
			const date = new Date(transaction.date);
			const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

			if (transaction.amount > 0) {
				totalIncome += amount;
				if (!monthlyIncome[monthYear]) {
					monthlyIncome[monthYear] = 0;
				}
				monthlyIncome[monthYear] += amount;
			} else {
				totalExpense += amount;
				if (!monthlyExpense[monthYear]) {
					monthlyExpense[monthYear] = 0;
				}
				monthlyExpense[monthYear] += Math.abs(amount);
			}
		});

		const report = {
			totalIncome,
			totalExpense,
			netBalance: totalIncome - totalExpense,
			monthlyIncome: Object.entries(monthlyIncome).map(([month, amount]) => ({ month, amount })),
			monthlyExpense: Object.entries(monthlyExpense).map(([month, amount]) => ({ month, amount })),
		};

		res.status(200).json({ userId, report });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
	}
};