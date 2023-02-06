const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const uri = process.env.MONGOPASSWORD
const db = mongoose.connection


try {
    mongoose.connect(uri, {

    }).then(() => {
        //console.log('connected to MONGO ATLAS')
    }).catch((err) => {
        console.log('MONGO ERR', err)
    })


} catch (err) {

    console.log(err)
}