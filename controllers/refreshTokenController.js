const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = (req, res) => {
    const cookies = req.cookie
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies)
    const refreshToken = cookies.jwt

    const userInstance = User.findOne({ refreshToken: refreshToken }).exec()
    if (!userInstance) return res.sendStatus(401)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if (err || userInstance.username !== decoded.username) return res.sendStatus(403)
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
            res.json({ "access-token": accessToken })
        }
    ) 
}

module.exports = { handleRefreshToken }