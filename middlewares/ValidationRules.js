const { check } = require('express-validator');

const registerValidator = [
    check('emailId').trim().toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a Valid Email'),
    check('password').notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 8 }).withMessage('Password is not Strong')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)./).withMessage('Password is not Strong'),
    check('name').trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long')
]

const loginValidator = [
    check('emailId').trim().toLowerCase()
        .notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password cannot be empty')
]

module.exports = {
    registerValidator,
    loginValidator
}