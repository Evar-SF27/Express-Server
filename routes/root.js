const  express = require('express')
const router = express.Router()
const path = require('path')

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

// Route Handlers
// const funcOne = (req, res, next) => {
//     console.log('First Function end')
//     next()
// }

// const funcTwo = (req, res, next) => {
//     console.log('Three')
//     next()
// }

// const funcThree = (req, res) => {
//     console.log('Three')
//     res.send('Route Handler executed successfully')
// }
// router.get('/hello(.html)?', [funcOne, funcTwo, funcThree ])

module.exports = router