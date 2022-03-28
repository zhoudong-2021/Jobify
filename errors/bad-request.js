import { StatusCodes } from "http-status-codes"

const badRequest = (res, msg) => {
    return res.status(StatusCodes.BAD_REQUEST).json({msg})
}

export default badRequest