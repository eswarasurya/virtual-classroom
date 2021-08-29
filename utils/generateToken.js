const jwt = require('jsonwebtoken')

// desc: generates jwt token for a given id
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })
}

module.exports = generateToken;