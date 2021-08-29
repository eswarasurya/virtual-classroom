const moment = require('moment')

const Assignment = require('../models/assignmentModel');
const User = require('../models/userModel');
const Submission = require('../models/submissionModel')

const {getAssignmentStatus, getSubmissionStatus} = require('../utils/helper')


// creates an assignment
// params description: String, students: Array, publishAt: Date string, deadline: Date string 
const createAssignment = async (req, res) => {
    try {
        const {description, students, publishedAt, deadline} = req.body;
        const assignment = await Assignment.create({description, publishedAt: moment(publishedAt), deadline: moment(deadline), createdBy: req.user._id})
        for(let i = 0; i < students.length; i++) {
            const student = await User.findOne({username: students[i], isTutor: false})
            if (student) {
                const submission = new Submission()
                submission.toAssignment = assignment._id
                submission.toStudent = student._id
                student.submissions.set(assignment._id.toString(), submission._id)
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

const removeSubmissionFromTutor = async (assignment) => {
    const tutor = await User.findById(assignment.createdBy)
    const index = tutor.assignments.indexOf(assignment._id)
    if (index === -1) return;
    const l = tutor.assignments.length;
    //swapping element to be removed to the last of array
    [tutor.assignments[index], tutor.assignments[l - 1]] = [tutor.assignments[l - 1], tutor.assignments[index]]
    tutor.assignments.pop();
    await tutor.save();
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
            student.submissions.delete(assignment._id.toString())
            await student.save()
            await submission.remove()
        }
        await removeSubmissionFromTutor(assignment)
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
        const {description, publishedAt, deadline} = req.body;
        const assignment = await Assignment.findById(req.params.id)
        if (!assignment) {
            throw new Error('Invalid Assignment ID')
        }
        if (!assignment.createdBy.equals(req.user._id)) {
            throw new Error('You can only update assignments that are created by you')
        }

        if (description) assignment.description = description
        if (publishedAt) assignment.publishedAt = moment(publishedAt)
        if (deadline) {
            assignment.deadline = moment(deadline)
        }
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

const handelTutorDetails = async (req, res) => {
    try {
        const assignmentId = req.params.id
        const assignment = await Assignment.findById(assignmentId)
        if (!assignment) throw new Error('Invalid ID')
        if (!assignment.createdBy.equals(req.user._id)) throw new Error('You cannot have access to this assignment')
        const submissions = []
        for(let i = 0; i < assignment.submissions.length; i++) {
            const sub = await Submission.findById(assignment.submissions[i]).populate('toStudent', 'username')
            const submissionStatus = getSubmissionStatus(sub.isSubmitted, sub.submitedAt, assignment.deadline)
            const temp = {
                user: sub.toStudent.username,
                status: sub.isSubmitted? 'Submited' : 'Not Submited',
                remark: sub.remark,
                submissionStatus, submissionStatus
            }
            submissions.push(temp)
        }
        const assignmentStatus = getAssignmentStatus(assignment.publishedAt, assignment.deadline)
        res.status(200).json({
            description: assignment.description,
            assignmentStatus: assignmentStatus,
            submissions: submissions
        })


    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: error.message
        })
    }
}


const handelStudentDetails = async (req, res) => {
    try {
        const assignmentId = req.params.id
        const submission = await Submission.findById(req.user.submissions.get(assignmentId))
        if (!submission) throw new Error('Invaled ID')
        const assignment = await Assignment.findById(assignmentId)
        var assignmentStatus = getAssignmentStatus(assignment.publishedAt, assignment.deadline)
        var submissionStatus = getSubmissionStatus(submission.isSubmitted, submission.submitedAt, assignment.deadline)

        res.status(200).json({
            description: assignment.description,
            remark: submission.isSubmitted? submission.remark : '',
            status: submission.isSubmitted? 'Submited' : 'Not Submited',
            assignmentStatus: assignmentStatus,
            submissionStatus, submissionStatus
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

const getDetails = async (req, res) => {
    if (req.user.isTutor) {
        handelTutorDetails(req, res)
    } else {
        handelStudentDetails(req, res)
    }
}

const assignmentFeed = async (req, res) => {
    try {
        const publishedAtFilter = req.query.publishedAt
        if (req.user.isTutor) {
            const createdAssignments = []
            const assignmentIds = req.user.assignments
            for (let i = 0; i < assignmentIds.length; i++) {
                const assignment = await Assignment.findById(assignmentIds[i])
                const assignmentStatus = getAssignmentStatus(assignment.publishedAt, assignment.deadline)
                if (publishedAtFilter && publishedAtFilter !== assignmentStatus) continue;
                const details = {
                    description: assignment.description,
                    publishedAt: assignment.publishedAt.toISOString(),
                    deadline: assignment.deadline.toISOString(),
                    status: assignmentStatus,
                    assignedTo: `${assignment.submissions.length} students`
                }
                createdAssignments.push(details)
            }
            res.status(200).json({
                assignments: createdAssignments
            })
        } else {
            const statusFilter = req.query.status
            const submissionIds = Array.from(req.user.submissions.values())
            const allSubmissions = []
            for (let i = 0; i < submissionIds.length; i++) {
                const submission = await Submission.findById(submissionIds[i]).populate('toAssignment', 'description deadline publishedAt')
                var submissionStatus = getSubmissionStatus(submission.isSubmitted, submission.submitedAt, submission.toAssignment.deadline)
                const assignmentStatus = getAssignmentStatus(submission.toAssignment.publishedAt, submission.toAssignment.deadline)
                if (publishedAtFilter && publishedAtFilter !== assignmentStatus) continue;
                if (statusFilter && statusFilter !== 'ALL' && statusFilter !== submissionStatus) continue;
                const details = {
                    assignmentDescription: submission.toAssignment.description,
                    assignmentDeadline: submission.toAssignment.deadline,
                    assignmentStatus: assignmentStatus,
                    submissionStatus: submission.isSubmitted? 'Submited' : 'Not Submited',
                    submissionStatus: submissionStatus,
                    remark: submission.isSubmitted? submission.remark : '',
                }
                allSubmissions.push(details)
            }
            res.status(200).json({
                submissions: allSubmissions
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {createAssignment, deleteAssignment, updateAssignment, getDetails, assignmentFeed}