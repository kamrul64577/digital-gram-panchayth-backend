
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);


router.post('/services_add', authController.services_add);
//router.post('/hospital', authController.hospital);

router.post('/categories_add', authController.categories_add);
//router.post('/categories', authController.categories);

router.post('/doctor_add', authController.doctor_add);



module.exports = router;