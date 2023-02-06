const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    number: { type: Number },
    password: { type: String },
    token: { type: String }
})

const User = mongoose.model('user', userSchema)

module.exports = User
