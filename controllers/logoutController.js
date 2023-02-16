const User = require('../models/User')

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const userInstance = await User.findOne({ refreshToken }).exec()
    if (!userInstance) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 60 * 60 * 24 })
        return res.sendStatus(204)
    }

    userInstance.refreshToken = ""
    const result = await userInstance.save()
    console.log(result)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 60 * 60 * 24 })
    res.sendStatus(204)
}

module.exports = { handleLogout }