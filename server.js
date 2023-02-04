const express = require('express')
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const app = express()
const PORT = process.env.PORT || 3500

// Custom middleware logger
app.use(logger)

// Third-party middleware:
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
// app.use('subdir', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employess', require('./routes/apis/employee'))

app.all('*', (req, res) =>{
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    } 
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
