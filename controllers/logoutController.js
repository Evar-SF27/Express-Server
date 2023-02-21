const User = require('../models/User')

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const userInstance = await User.findOne({ refreshToken }).exec()
    if (!userInstance) {
        res.clearCookie('jwt', { httpOnly: true,sameSite: 'None', secure: true, maxAge: 60 * 60 * 24 })
        return res.sendStatus(204)
    }

    userInstance.refreshToken = ""
    await userInstance.save()
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 24 }) 
    res.sendStatus(204)
}

module.exports = { handleLogout }