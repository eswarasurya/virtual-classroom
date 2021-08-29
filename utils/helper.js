const moment = require('moment')

// desc: returns assignment status
const getAssignmentStatus = (publishedAt, deadline) => {
    var assignmentStatus;
    const currentDate = moment()
    if (publishedAt > currentDate) {
        assignmentStatus = 'SCHEDULED'
    } else if (currentDate < deadline) {
        assignmentStatus = 'ONGOING'
    } else {
        assignmentStatus = 'Deadline passed'
    }
    return assignmentStatus;
}

// desc: returns submission status
const getSubmissionStatus = (isSubmitted, submitedAt, deadline) => {
    var submissionStatus = 'None';
    const currentDate = moment()
    if (isSubmitted && submitedAt < deadline) {
        submissionStatus = 'SUBMITTED'
    } else if (isSubmitted && submitedAt > deadline) {
        submissionStatus = 'OVERDUE'
    } else if (!isSubmitted && deadline < currentDate) {
        submissionStatus = 'OVERDUE'
    } else if (!isSubmitted) {
        submissionStatus = 'PENDING'
    }
    return submissionStatus;
}

module.exports = {getAssignmentStatus, getSubmissionStatus}