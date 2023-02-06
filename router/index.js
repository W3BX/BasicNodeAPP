const express = require('express')
const app = express()
const router = express.Router()
require('../server/config')
const user = require('../models/userSchema')
const comment = require('../models/commentModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/user')
//middleware



//routers

router.get('/', (req, res) => {
    res.send('API Home working')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body.data

    try {

        const exits = await user.findOne({ email: email })
        if (exits) {
            const checkPassword = bcrypt.compareSync(password, exits.password)

            if (checkPassword) {
                const token = jwt.sign({ _id: exits._id }, process.env.TOKEN)
                const tokenUpdated = await user.updateOne({ email: email },
                    {
                        $set: {
                            token: token
                        }
                    })


                res.cookie('jwtToken', token, { httpOnly: true })
                res.send({
                    msg: 'Logged in sucesfully',
                    data: exits,
                    exits: true,
                    type: 2
                })
            } else {
                res.send({
                    msg: 'Wrong password',
                    exits: false,
                    type: 1
                })
            }

        } else {
            res.send({
                msg: 'User does not exits',
                exits: false,
                type: 0
            })

        }

    } catch (err) {
        res.send({
            msg: 'Technical error',
            err: err
        })

    }


})

router.post('/signup', async (req, res) => {
    try {
        const { name, email, number, password } = req.body.data
        const exits = await user.findOne({ email: email })

        if (exits) {
            res.send({
                msg: 'Email already exits',
                status: 400
            })
        } else {

            const hash = bcrypt.hashSync(password, saltRounds)
            const userreg = new user({ name, email, number, password: hash })

            const saved = await userreg.save()
            if (saved) {
                res.send({
                    msg: "User registred.",
                    status: 200
                })
            } else {
                res.send({
                    msg: "Technical error.",
                    status: 400
                })
            }

        }
    }
    catch (err) {

        res.send({
            message: "Technical error.",
            err: err
        })

    }


})

router.post('/data', userMiddleware, (req, res) => {
    res.send(req.user)
})

router.post('/removeUser', (req, res) => {
    res.clearCookie('jwtToken').send({ status: 800, msg: 'logged out sucesfully' })
})

router.post('/saveComment', async (req, res) => {
    try {

        const { data, user } = req.body.postData
        const commnets = new comment({ user: user, comment: data })

        const saved = await commnets.save()

        if (saved) {
            res.send({
                status: 200,
                msg: 'Commemt posted'
            })
        } else {
            res.send({
                status: 400,
                msg: 'Something went wrong'
            })
        }


    } catch (err) {

        res.send({
            status: 404,
            msg: err
        })
    }

})


router.post('/showComment', async (req, res) => {

    try {

        const commnets = await comment.find({}, { 'user': 1, 'comment': 1, 'createdAt': 1, '_id': 0 })
        
        if (commnets) {
            res.send({
                status: 200,
                data: commnets.reverse()
            })
        } else {
            res.send({
                status: 400,
                msg: 'err'
            })
        }


    } catch (err) {
        res.send({
            status: 400,
            msg: err
        })
    }

})
module.exports = router