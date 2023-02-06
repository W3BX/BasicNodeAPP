const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: { type: String },
    comment: { type: String },
}, {
    timestamps: true
})

const comment = mongoose.model('comments', commentSchema)

module.exports = comment