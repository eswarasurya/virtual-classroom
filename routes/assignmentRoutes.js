const express = require('express')
const router = express.Router()

const {protect, tutor} = require('../middleware/authMiddleware')

const {
    createAssignment,
    deleteAssignment,
    updateAssignment,
    getDetails,
    assignmentFeed,
    feedWithFilter
} = require('../controllers/assignmentController')

router.post('/create', protect, tutor, createAssignment);
router.delete('/delete/:id', protect, tutor, deleteAssignment);
router.put('/update/:id', protect, tutor, updateAssignment);
router.get('/details/:id', protect, getDetails);
router.get('/feed', protect, assignmentFeed);
router.get('/filter', protect, feedWithFilter)

module.exports = router