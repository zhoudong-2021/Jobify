import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email'
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        trim: true,
        default: 'last name'
    },
    location: {
        type: String,
        trim: true,
        default: 'my city'
    },
})
// Use pre middleware to hash password.
userSchema.pre('save', async function () {
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

// Use instance methods to generate jwt token.
userSchema.methods.generateToken = function () {
    return jwt.sign({ userId: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

// Check password
userSchema.methods.checkPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}


export default mongoose.model('User', userSchema)