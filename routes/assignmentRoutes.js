const express = require('express')
const router = express.Router()

const {protect, tutor} = require('../middleware/authMiddleware')

const {
    createAssignment
} = require('../controllers/assignmentController')

router.post('/create', protect, tutor, createAssignment);

module.exports = router