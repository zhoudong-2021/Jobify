import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { badRequestError, UnauthenticatedError } from '../errors/customErrors.js'

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

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return badRequestError(res, 'All fileds must be filled.')
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return UnauthenticatedError(res, 'Invalid user.')
    }
    const isValidPassword = user.checkPassword(password)
    console.log(password);
    console.log(isValidPassword);
    if(!isValidPassword){
        return UnauthenticatedError(res, 'Invalid user')
    }
    user.password = undefined
    const token = user.generateToken() 
    return res.status(StatusCodes.OK).json({user, token})
}

const updateUser = (req, res) => {
    res.send('updateUser')
}

export {
    register,
    login,
    updateUser
}