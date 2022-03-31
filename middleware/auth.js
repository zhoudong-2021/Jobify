import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from '../errors/customErrors.js'

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return UnauthenticatedError(res, 'Unauthorized access.')
    }

    const token = authHeader.split(' ')[1]
    try {
        req.userId = jwt.verify(token, process.env.JWT_SECRET).userId
    } catch (error) {
        return UnauthenticatedError(res, 'Unauthorized access.')
    }
    next()
}

export default authMiddleware