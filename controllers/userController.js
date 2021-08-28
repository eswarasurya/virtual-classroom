const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')

// params: username, password
const loginUser = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username})
    if (user) {
        res.status(200).json({
            userType: user.isTutor ? 'Tutor' : 'Student',
            _id: user._id,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401).json({
            message: 'Invalid user id'
        })
    }
}

const registerTutor = async (req, res) => {
    try {
        const {username, password} = req.body;
        const checkUser = await User.findOne({username})
        if (checkUser) {
            throw new Error('User already exists')
        }
        const user = await User.create({username, password, isTutor: true})
        res.status(201).json({
            userType: user.isTutor ? 'Tutor' : 'Student',
            _id: user._id,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

const registerStudent = async (req, res) => {
    try {
        const {username, password} = req.body;
        const checkUser = await User.findOne({username})
        if (checkUser) {
            throw new Error('User already exists')
        }
        const user = await User.create({username, password, isTutor: false})
        res.status(201).json({
            userType: user.isTutor ? 'Tutor' : 'Student',
            _id: user._id,
            token: generateToken(user._id)
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}



module.exports = {loginUser, registerTutor, registerStudent}