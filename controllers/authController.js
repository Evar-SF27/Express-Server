const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ 'message': 'Username and Password are required'})

    const userInstance = await User.findOne({ username: username }).exec()
    if (!userInstance) return res.sendStatus(401)

    const matchPassword = bcrypt.compare(password, userInstance.password)
    if (matchPassword) {
        // JSON WEB TOKEN
        const roles = Object.values(userInstance.roles)

        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": userInstance.username,
                    "roles":  roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '30s' }
        )
        const refreshToken = jwt.sign(
            { "username": userInstance.username },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: '1d' }
        )

        userInstance.refreshToken = refreshToken
        const result = await userInstance.save()

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }) // secure: true
        res.json({ roles, accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }