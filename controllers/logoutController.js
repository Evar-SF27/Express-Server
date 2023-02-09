const usersDB = {
    users: require('../models/users.json'),
    setUsers: (data) => { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    const cookies = req.cookie
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const userInstance = usersDB.users.find(user => user.refreshToken === refreshToken)
    if (!userInstance) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 60 * 60 * 24 })
        return res.sendStatus(204)
    }

    const otherUsers = usersDB.users.filter(user => user.refreshToken !== userInstance.refreshToken)
    const currentUser = { ...userInstance, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 24 })
    res.sendStatus(204)
}

module.exports = { handleLogout }