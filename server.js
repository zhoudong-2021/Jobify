import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import dotenv from 'dotenv'

dotenv.config()


const app = express()

app.get('/', (req, res) => {
    res.send('Welcome')
    // throw new Error('a server error')
    
})

//middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})