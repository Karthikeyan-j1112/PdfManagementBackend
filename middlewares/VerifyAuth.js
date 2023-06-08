const jwt = require('jsonwebtoken');

const VerifyToken = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).json({ result: false, verify: "fail", error: 'Authorization token required' })
        return
    }
    const token = authorization.split(' ')[1]

    try {
        const {id} = jwt.verify(token, process.env.SECRET)

        req.user = id
                
        next();
    } catch (error) {
        res.status(401).json({ result: false, verify: "fail", error: 'Request is not authorized' })
    }
}

module.exports = VerifyToken