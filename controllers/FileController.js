
const fs = require('fs')
const { google } = require('googleapis')
const FileModel = require('../models/FileModel')
const { default: mongoose } = require('mongoose')
const CommentModel = require('../models/CommentModel')

const uploadToDrive = async (file) => {
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive.file'],
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
            client_id: process.env.GOOGLE_CLIENT_ID,
        }
    })

    const fileMetaData = {
        name: file.originalname,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    }

    const media = {
        mimeType: file.memetype,
        body: fs.createReadStream(file.path),
    }

    const driveService = google.drive({ version: 'v3', auth })

    const response = await driveService.files.create({
        requestBody: fileMetaData,
        media: media,
        fields: 'id'
    })

    fs.unlinkSync(file.path, () => {
        console.log("file deleted on local");
    });

    return response;
}

const uploadFile = async (req, res) => {
    try {
        const files = req.files
        let result = []
        for (let i = 0; i < files.length; i++) {
            const response = await uploadToDrive(files[i])

            const file = await FileModel.create({ name: files[i].originalname, userId: req.user, googleDriveId: response.data.id, inviteId: (new mongoose.mongo.ObjectId()) })

            result.push({ name: file.name, id: file._id, created: 'success' })
        }

        res.json({ result: 'success', data: result })

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: 'fail', error })
    }
}

const searchFiles = async (req, res) => {
    try {
        const search = '.*' + req.params.id + '.*'
        const limit = 10
        let files = await FileModel.find({ userId: req.user, name: { $regex: search, $options: 'i' } }).limit(limit).skip(limit * Math.max(0, req.query.page))

        files = files.map(file => {
            const upload = String((file.createdAt.getDate()).toString()).padStart(2, '0') + '/' + String((file.createdAt.getMonth() + 1).toString()).padStart(2, '0') + '/' + file.createdAt.getFullYear()
            return { _id: file._id, upload, name: file.name }
        })

        const count = await FileModel.find({ userId: req.user, name: { $regex: search, $options: 'i' } }).count()

        const totalPages = (count % limit === 0) ? Math.trunc(count / limit) : Math.trunc(count / limit) + 1;

        res.json({ result: true, files, totalPages })

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: 'fail', error })
    }
}

const getPdf = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id, { googleDriveId: 1, userId: 1 })

        if (file.userId.toString() !== req.user) {
            return res.status(401).json({ result: 'fail', error: "You don't have access to the file" })
        }

        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive.file'],
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
                client_id: process.env.GOOGLE_CLIENT_ID,
            }
        })

        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.get({
            fileId: file.googleDriveId,
            alt: 'media',
        }, { responseType: 'stream' });

        response.data.pipe(res)

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: 'fail', error })
    }
}

const getPdfDetails = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id, { name: 1, createdAt: 1, userId: 1, inviteId: 1 })

        if (file.userId.toString() !== req.user) {
            return res.status(401).json({ result: 'fail', error: "You don't have access to the file" })
        }

        const upload = String((file.createdAt.getDate()).toString()).padStart(2, '0') + '/' + String((file.createdAt.getMonth() + 1).toString()).padStart(2, '0') + '/' + file.createdAt.getFullYear()

        res.json({ result: 'success', name: file.name, upload, inviteId: file.inviteId })

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: 'fail', error })
    }
}

const getInvitePdf = async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id, { googleDriveId: 1, inviteId: 1 })

        if (file.inviteId.toString() !== req.query.inviteId) {
            return res.status(401).json({ result: 'fail', error: "You don't have access to the file" })
        }

        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive.file'],
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
                client_id: process.env.GOOGLE_CLIENT_ID,
            }
        })

        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.get({
            fileId: file.googleDriveId,
            alt: 'media',
        }, { responseType: 'stream' });

        return response.data.pipe(res)

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: 'fail', error })
    }
}

const getFileComments = async (req, res) => {
    try {

        const file = await FileModel.findById(req.params.id, { userId: 1 })
        const limit = 10;

        if (file.userId.toString() !== req.user) {
            return res.status(401).json({ result: 'fail', error: "You don't have access to the file" })
        }

        const comments = await CommentModel.find({ fileId: req.params.id }).sort({ createdAt: -1 }).limit(limit).skip(limit * Math.max(0, req.query.page))

        const count = await CommentModel.find({ fileId: req.params.id }).count()

        const totalPages = (count % limit === 0) ? Math.trunc(count / limit) : Math.trunc(count / limit) + 1;

        res.json({ result: 'success', comments, totalPages })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: 'fail', error })
    }
}

module.exports = {
    uploadFile,
    searchFiles,
    getPdf,
    getPdfDetails,
    getInvitePdf,
    getFileComments
}