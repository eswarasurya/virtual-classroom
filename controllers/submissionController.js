const Submission = require('../models/submissionModel')


const submitAnswer = async (req, res) => {
    try {
        const submissionId = req.params.id
        const submission = await Submission.findById(submissionId)
        if (!submission.toStudent.equals(req.user._id)) {
            throw new Error('You cannot submit to this assignment')
        }
        if (submission.isSubmitted) {
            throw new Error('Already submitted')
        }

        const {remark} = req.body
        console.log('remark', remark)
        submission.remark = remark
        submission.isSubmitted = true
        submission.submitedAt = new Date()
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