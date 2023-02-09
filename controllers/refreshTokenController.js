const usersDB = {
    users: require('../models/users.json'),
    setUsers: (data) => { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = (req, res) => {
    const cookies = req.cookie
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies)
    const refreshToken = cookies.jwt

    const userInstance = usersDB.users.find(user => user.refreshToken === refreshToken)
    if (!userInstance) return res.sendStatus(401)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if (err || userInstance.username !== decoded.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '30s' }
            )
            res.json({ "access-token": accessToken })
        }
    ) 
}

module.exports = { handleRefreshToken }