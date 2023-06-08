const CommentModel = require("../models/CommentModel");
const FileModel = require("../models/FileModel");

const addComment = async (req, res) => {
    try {

        const file = await FileModel.findById(req.params.id, { inviteId: 1 })

        if (file.inviteId.toString() !== req.body.inviteId) {
            return res.status(401).json({ result: 'fail', error: "You cannot add comment to this file" })
        }

        const comment = await CommentModel.create({ fileId: req.params.id, comment: req.body.comment, userName: req.body.userName })

        res.json({ result: 'success', comment })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: 'fail', error })
    }
}

const getComments = async (req, res) => {
    try {

        const file = await FileModel.findById(req.params.id, { inviteId: 1 })
        const limit = 10;

        if (file.inviteId.toString() !== req.query.inviteId) {
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
    addComment,
    getComments
}