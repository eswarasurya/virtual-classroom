const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }]
})

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment
