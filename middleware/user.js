const express = require('express')
const jwt = require('jsonwebtoken')
const user = require('../models/userSchema')


const Middleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken
        const veriftTKN = jwt.verify(token, process.env.TOKEN)

        const rootuser = await user.findOne({ _id: veriftTKN._id })

        if (!rootuser) { throw new Error('user not found') }

        req.token = token
        req.user = rootuser

        next()
    } catch (err) {

        res.send({
            status: 404,
            msg: 'user not found'
        })
    }
}

module.exports = Middleware