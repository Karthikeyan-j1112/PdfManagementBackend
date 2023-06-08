const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    }
}, { collection: 'users', timestamps: true })

module.exports = mongoose.model('user', UserSchema)
