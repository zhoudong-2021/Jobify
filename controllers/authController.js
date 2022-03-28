import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { badRequestError } from '../errors/index.js'

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return badRequestError(res, 'All fileds must be filled.')
        }
        let user = await User.create(req.body)
        const token = user.generateToken()
        // Filter password
        user = {
            email,
            name,
            lastName: user.lastName,
            location: user.location
        }
        res.status(StatusCodes.CREATED).json({ user, token })
    } catch (error) {
        next(error)
    }
}

const login = (req, res) => {
    res.send('login')
}

const updateUser = (req, res) => {
    res.send('updateUser')
}

export {
    register,
    login,
    updateUser
}