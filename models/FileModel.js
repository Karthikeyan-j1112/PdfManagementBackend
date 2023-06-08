const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    googleDriveId: {
        type: String,
        required: true
    },
    inviteId  : {
        type : mongoose.Types.ObjectId        
    }
}, { collection: 'files', timestamps: true })

module.exports = mongoose.model('file', FileSchema)
