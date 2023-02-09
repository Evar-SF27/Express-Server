const usersDB = {
    users: require('../models/users.json'),
    setUsers: (data) => { this.users = data }
}
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ 'message': 'Username and Password are required'})

    const userInstance = usersDB.users.find(user => user.username === username)
    if (!userInstance) return res.sendStatus(401)

    const matchPassword = bcrypt.compare(password, userInstance.password)
    if (matchPassword) {
        // JSON WEB TOKEN
        const accessToken = jwt.sign(
            { "username": userInstance.username },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '30s' }
        )
        const refreshToken = jwt.sign(
            { "username": userInstance.username },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: '1d' }
        )
        const otherUsers = usersDB.users.filter(user => user.username === username)
        const currentUser = {...userInstance, refreshToken}
        usersDB.setUsers([...otherUsers, currentUser ])
        await fsPromises.writeFile(
            path.join(path.dirname(__dirname, '..', 'models', 'users.json')),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ 'accessToken': accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }