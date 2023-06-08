const { addComment, getComments } = require('../controllers/CommentController')

const router = require('express').Router()

router.post('/addComment/:id', addComment)
router.get('/getComments/:id', getComments)

module.exports = router