import express from "express";
import {
    register,
    login,
    updateUser
} from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";
import rateLimiter from 'express-rate-limit'

// Set limit of requests per 15 min
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP, please try again after 15 minutes',
})

const router = express.Router()

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authMiddleware, updateUser)

export default router


