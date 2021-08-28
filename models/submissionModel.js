const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    remark: {
        type: String,
    },
    isSubmitted: {
        type: Boolean,
        required: true,
        default: false
    },
    submitedAt: {
        type: Date
    },
    toStudent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    }
})

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;

