import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import authRouter from './routes/authRoutes.js'
import jobRouter from './routes/jobRoutes.js'
// import 'express-async-errors'
import morgan from 'morgan'

dotenv.config()

const app = express()

app.use(express.json())


// routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// print log info
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

const port = process.env.PORT || 5000

// Start server
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()

