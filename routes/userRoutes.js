const express = require('express')
const router = express.Router()
const {
    loginUser, registerTutor, registerStudent
} = require('../controllers/userController')

router.post('/login', loginUser);
router.post('/registertutor', registerTutor);
router.post('/registerstudent', registerStudent);

module.exports = router