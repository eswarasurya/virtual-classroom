const express = require('express')
const router = express.Router()
const {
    loginUser, registerTutor, registerStudent
} = require('../controllers/userController')

router.post('/login', loginUser);
router.post('/registerTutor', registerTutor);
router.post('/registerStudent', registerStudent);

module.exports = router