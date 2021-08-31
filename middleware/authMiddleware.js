const { json } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select('-password')
            if (!user) throw Error('Invalid token')
            req.user = user
            next()
        }
        else {
            throw new Error('Request is not authorised')
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            message: error.message
        })
    }
}

//Checks wheather a user is tutor or not
const tutor = (req, res, next) => {
    try {
        if (req.user && req.user.isTutor) {
            next();
        } else {
            throw new Error('Not authorised as an tutor')
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).json()
    }
}


module.exports = {protect, tutor}