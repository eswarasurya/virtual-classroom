const express = require('express')
const router = express.Router()

const {submitAnswer} = require('../controllers/submissionController')
const {protect} = require('../middleware/authMiddleware')

router.post('/:id', protect, submitAnswer)

module.exports = router