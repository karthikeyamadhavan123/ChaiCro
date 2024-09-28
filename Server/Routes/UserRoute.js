const express = require('express');
const router = express.Router();
const ExistingUser = require('../middlewares/RegisterMiddleware.js');
const registerController = require('../Controllers/UserController.js');
const upload = require('../util/multer.js');

// Route for registration with file upload
router.post('/register', upload.single('image'), ExistingUser.existingUser, registerController.Register);
router.post('/login', registerController.Login);
router.post('/logout', registerController.Logout);
router.post('/forgot-password', registerController.forgotPassword);
router.post('/reset-password/:token', registerController.resetPassword);
router.get('/:userId',registerController.getCurrentUserImage);
module.exports = router;
