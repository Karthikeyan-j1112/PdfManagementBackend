const { validationResult } = require('express-validator')
const { registerUser, login } = require('../controllers/UserController')
const { registerValidator, loginValidator } = require('../middlewares/ValidationRules')
const VerifyToken = require('../middlewares/VerifyAuth')
const router = require('express').Router()

router.post('/register', registerValidator, async (req, res) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
        return await registerUser(req, res)
    }

    const { path, msg } = result.errors[0]

    res.status(400).json({ result: false, errorFields: [path], error: msg })
})

router.post('/login', loginValidator, async (req, res) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
        return await login(req, res)
    }

    const { path, msg } = result.errors[0]

    res.status(400).json({ result: false, errorFields: [path], error: msg })
})

router.use(VerifyToken)

router.post('/verify', (req, res) => {
    res.json({ result: true, verify: "success" })
})

module.exports = router
