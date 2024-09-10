const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../config/cloudinary');

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/img', upload.single('img'), userController.updateUser);

module.exports = router;
