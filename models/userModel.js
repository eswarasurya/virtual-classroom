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
        default: fasle
    },
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }]
})

const User = mongoose.model('User', userSchema)
module.exports = User
