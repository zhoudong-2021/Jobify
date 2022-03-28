import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (err, req, res, next) => {
    let defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: 'Something went wrong, try again later'
    }
    if(err.name === "ValidationError"){
        defaultError.msg = Object.values(err.errors).map(err => err.message).join(',')
        defaultError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.code && err.code === 11000){
        defaultError.msg =  `${Object.keys(err.keyValue)} has been used.`
        defaultError.statusCode = StatusCodes.BAD_REQUEST
    }
    console.log(err)
    return res.status(defaultError.statusCode).json({ msg: defaultError })
    
}


export default errorHandlerMiddleware