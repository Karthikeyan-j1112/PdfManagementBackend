const { uploadFile, searchFiles, getPdf, getPdfDetails, getInvitePdf, getFileComments } = require('../controllers/FileController');
const VerifyToken = require('../middlewares/VerifyAuth')
const router = require('express').Router()

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/getpdfinvite/:id', getInvitePdf)

router.use(VerifyToken)
router.post('/upload', upload.array('files'), uploadFile)
router.get('/searchFiles/:id', searchFiles)
router.get('/getpdf/:id', getPdf)
router.get('/getpdfdetails/:id', getPdfDetails)
router.get('/getFileComments/:id', getFileComments)

module.exports = router
