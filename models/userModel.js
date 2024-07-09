
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema

const userSchema = new Schema ({

    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
        minlength: 8
    }
})

// static signup method
userSchema.statics.signup = async function (email, password)  {

        const exists = await this.findOne({email})
        if (exists) {
            throw new Error('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.create({email, password: hashedPassword})

        return user

}

module.exports = mongoose.model('User', userSchema)