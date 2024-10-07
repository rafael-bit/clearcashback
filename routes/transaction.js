const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/:userId', authMiddleware, transactionController.getAllTransactions);
router.put('/:id', authMiddleware, transactionController.updateTransaction);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);
router.get('/report/:userId', authMiddleware, transactionController.getFinancialReport);

module.exports = router;
