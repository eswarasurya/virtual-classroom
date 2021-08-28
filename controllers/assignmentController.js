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
                //
                student.submissions1.set(assignment._id.toString(), submission._id)
                //
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

const removeSubmissionFromStudent = async (student, submissionId) => {
    const index = student.submissions.indexOf(submissionId)
    if (index === -1) return;
    const l = student.submissions.length;
    //swapping element to be removed to the last of array
    [student.submissions[index], student.submissions[l - 1]] = [student.submissions[l - 1], student.submissions[index]]
    student.submissions.pop();
    
    await student.save();
}


const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
        if (!assignment) {
            throw new Error('Invalid Assignment ID')
        }
        if (!assignment.createdBy.equals(req.user._id)) {
            throw new Error('You can only delete assignments that are created by you')
        }

        const submissions = assignment.submissions
        for (let i = 0; i < submissions.length; i++) {
            const submission = await Submission.findById(submissions[i])
            const student = await User.findById(submission.toStudent)
            //
            student.submissions1.delete(assignment._id.toString())
            await student.save()
            //
            await removeSubmissionFromStudent(student, submissions[i]);
            await submission.remove()
        }
        
        await assignment.remove()
        res.status(200).json({
            message: "Assignemnt successfully removed"
        })
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            message: error.message
        })
    }
}

const updateAssignment = async (req, res) => {
    try {
        const {description, publishAt, deadline} = req.body;
        const assignment = await Assignment.findById(req.params.id)
        if (!assignment) {
            throw new Error('Invalid Assignment ID')
        }
        if (!assignment.createdBy.equals(req.user._id)) {
            throw new Error('You can only update assignments that are created by you')
        }

        if (description) assignment.description = description
        if (publishAt) assignment.publishAt = new Date(publishAt)
        if (deadline) assignment.deadline = new Date(deadline)
        await assignment.save()
        res.json({
            message: "update Successful"
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: error.message
        })
    }

}


module.exports = {createAssignment, deleteAssignment, updateAssignment}