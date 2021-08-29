const moment = require('moment')

const Submission = require('../models/submissionModel')


// desc: Submit an remark for assignment
// path: /submission/:id
// access: private
const submitAnswer = async (req, res) => {
    try {
        const assignmentId = req.params.id
        const submission = await Submission.findById(req.user.submissions.get(assignmentId)).populate('toAssignment', 'deadline publishedAt')
        if (!submission) {
            throw new Error('Id not found')
        }
        if (submission.isSubmitted) {
            throw new Error('Already submitted')
        }
        if (!submission.toStudent.equals(req.user._id)) {
            throw new Error('You cannot submit to this assignment')
        }
        const currentDate = moment()
        if (currentDate < submission.toAssignment.publishedAt) {
            throw new Error('Assignment has not started Yet')
        }

        const {remark} = req.body
        submission.remark = remark
        submission.isSubmitted = true
        submission.submitedAt = moment()
        await submission.save()
        
        res.status(200).json({
            message: "successfully submitted"
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {submitAnswer}