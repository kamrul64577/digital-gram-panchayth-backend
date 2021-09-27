
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);


router.post('/services_add', authController.services_add);




module.exports = router;