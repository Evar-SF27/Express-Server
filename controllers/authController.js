const usersDB = {
    users: require('../models/users.json'),
    setUsers: (data) => { this.users = data }
}
const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ 'message': 'Username and Password are required'})

    const userInstance = usersDB.users.find(user => user.username === username)
    if (!userInstance) return res.sendStatus(401)

    const matchPassword = bcrypt.compare(password, userInstance.password)
    if (matchPassword) {
        res.status(200).json({ 'message': 'User ${username} is logged in'})
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }