const moment = require('moment')

const Submission = require('../models/submissionModel')


//takes assignment id in params
const submitAnswer = async (req, res) => {
    try {
        const assignmentId = req.params.id
        const submission = await Submission.findById(req.user.submissions.get(assignmentId))
        if (!submission) {
            throw new Error('Id not found')
        }
        if (submission.isSubmitted) {
            throw new Error('Already submitted')
        }
        if (!submission.toStudent.equals(req.user._id)) {
            throw new Error('You cannot submit to this assignment')
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