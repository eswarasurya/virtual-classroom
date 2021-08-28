const express = require('express')
const dotenv = require('dotenv')

const connectDB = require('./config/db')

const userRoutes = require('./routes/userRoutes')
const assignmentRoutes = require('./routes/assignmentRoutes')

dotenv.config()

connectDB()
const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.send(`API is running...`)
})

app.use('/user', userRoutes);
app.use('/assignment', assignmentRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running on port ${PORT}`))