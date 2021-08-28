const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isTutor: {
        type: Boolean,
        required: true,
        default: false
    },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    submissions1: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: new Map()
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
