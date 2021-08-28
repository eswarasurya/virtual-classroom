const Assignment = require('../models/assignmentModel');
const User = require('../models/userModel');
const Submission = require('../models/submissionModel')


// creates an assignment
// params description: String, students: Array, publishAt: Date string, deadline: Date string 
const createAssignment = async (req, res) => {
    try {
        const {description, students, publishAt, deadline} = req.body;
        const assignment = await Assignment.create({description, publishAt: new Date(publishAt), deadline: new Date(deadline), createdBy: req.user._id})
        for(let i = 0; i < students.length; i++) {
            const student = await User.findOne({username: students[i], isTutor: false})
            if (student) {
                const submission = new Submission()
                submission.toAssignment = assignment._id
                submission.toStudent = student._id
                student.submissions.push(submission._id)
                assignment.submissions.push(submission._id)
                await submission.save()
                await student.save()
                
            }
        }
        const tutor = await User.findById(req.user._id)
        await assignment.save()
        tutor.assignments.push(assignment)
        await tutor.save()
        res.status(200).json({
            assignment
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: error.message
        })
    }
}



module.exports = {createAssignment}