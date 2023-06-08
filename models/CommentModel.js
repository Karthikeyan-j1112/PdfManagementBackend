const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replies: {
        type: [{
            type: String,
            required: true
        }],
        required : true,
        default : []
    }

}, { collection: 'comments', timestamps: true })

module.exports = mongoose.model('comment', CommentSchema)
