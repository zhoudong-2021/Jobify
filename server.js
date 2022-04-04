import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import authRouter from './routes/authRoutes.js'
import jobRouter from './routes/jobRoutes.js'
// import 'express-async-errors'
import morgan from 'morgan'
import authMiddleware from './middleware/auth.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'


dotenv.config()

const app = express()
app.use(express.json())

// Security middleware
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

// Serve static files for deployment
const __dirname = dirname(fileURLToPath(import.meta.url))
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

// routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, jobRouter)

// only when ready to deploy
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })

// Error Middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


// print log info
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

const port = process.env.PORT || 5000

// Start server
const start = async () => {
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

