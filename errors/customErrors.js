import { StatusCodes } from "http-status-codes"

const badRequestError = (res, msg) => {
    return res.status(StatusCodes.BAD_REQUEST).json({msg})
}

const notFoundError = (res, msg) => {
    return res.status(StatusCodes.NOT_FOUND).json({msg})
 }

const UnauthenticatedError = (res, msg) => {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg})
 }

export {
    UnauthenticatedError,
    badRequestError,
    notFoundError
}