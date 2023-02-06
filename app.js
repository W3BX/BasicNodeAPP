const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const MainROUTER = require('./router/index')
const PORT = process.env.PORT
const server = app.listen(PORT)
const io = require('socket.io')(server, {
    cors: {
        credentials: true, origin: true
    }
})

const { saveComment } = require('./socket/index')

//setting up cros
app.use(cors({ credentials: true, origin: true }))

// use for json data **mandatory**
app.use(express.json())
//cookie parser
app.use(cookieParser())
//Main Router
app.use('/', MainROUTER)

//creating socket
io.on('connection', socket => {
   
    socket.on('send_comment', async data => {
        const savecomment = await saveComment(data)
        io.emit('send_saved_comments', ({ data: savecomment.reverse(), socket_id: socket.id }))
        socket.emit('msg_status', { sent: 1 })
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

})


