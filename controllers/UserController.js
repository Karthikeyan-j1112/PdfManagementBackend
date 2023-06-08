const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' })
}

const registerUser = async (req, res) => {
    try {
        const { emailId, password, name } = req.body
        const exists = await UserModel.find({ emailId })

        if (exists.length > 0) {
            res.status(400).json({ result: false, errorFields: ['emailId'], error: 'This email id is already registered' })
            return
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const user = await UserModel.create({ emailId, password: hash, name })

        const token = createToken(user._id)

        res.json({ result: true, token, name })

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: false, error })
        return
    }
}

const login = async (req, res) => {
    try {

        const { emailId, password } = req.body
        const user = await UserModel.findOne({ emailId })

        if (!user) {
            res.status(404).json({ result: false, errorFields: ['emailId'], error: 'This email id is not registered' })
            return
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            res.status(400).json({ result: false, errorFields: ['password'], error: `The password is incorrect` })
            return
        }

        const token = createToken(user._id)

        res.json({ result: true, token, name: user.name })

    } catch (error) {
        console.log(error);
        res.status(400).json({ result: false, error })
        return
    }
}



module.exports = {
    registerUser,
    login
}