const usersDB = {
    users: require('../models/users.json'),
    setUsers: (data) => { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) return res.status(400).json({ 'message': 'Username and Password are required'})

    const duplicate = usersDB.users.find(user => user.username === username)
    if (duplicate) return res.status(409)

    try {
        // Encrypting the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            'username': username,
            'roles': { "User": 2001 },
            'password': hashedPassword
        }
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users)
        res.status(201).json({ 'success': `New User ${username} created successfully!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }