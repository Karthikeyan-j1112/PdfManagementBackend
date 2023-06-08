const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config()
const UserRoutes = require('./routes/UserRoutes')
const FileRoutes = require('./routes/FileRoutes')
const CommentRoutes = require('./routes/CommentRoutes')
const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const port = process.env.PORT

app.use('/api/users', UserRoutes)

app.use('/api/files', FileRoutes)

app.use('/api/comments',CommentRoutes)

try {
    mongoose.connect(process.env.MONGO_URI)
        .then((db) => {
            app.listen(port, () => console.log(`Listening on the port ${port}`))
        })
        .catch((err) => {
            console.log(err);
        })
} catch (error) {
    console.log(error);
}
