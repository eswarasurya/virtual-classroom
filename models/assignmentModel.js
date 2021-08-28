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
    status: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }]
})

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment
