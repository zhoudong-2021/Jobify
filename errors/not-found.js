import { StatusCodes } from "http-status-codes"

const notFound = (res, msg) => {
   return res.status(StatusCodes.NOT_FOUND).json({msg})
}

export default notFound