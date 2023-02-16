const User =  require('../models/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { username, password } = req.body
    
    // Checking if the username and password are passed in the request
    if (!username || !password) return res.status(400).json({ 'message': 'Username and Password are required'})
    // Checking if a user with the username already exists
    const duplicate = await User.findOne({ username: username }).exec()
    if (duplicate) return res.status(409)
    //Create and store a new user
    try {
        // Encrypting the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await User.create({
            'username': username,
            'password': hashedPassword
        })
        console.log(result)

        res.status(201).json({ 'success': `New User ${username} created successfully!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }