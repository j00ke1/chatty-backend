const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const { formatMessage } = require('./utils/messages')
const { userJoin, getUserById, getUsersInRoom, userLeave } = require('./utils/users')

const app = express()
const server = http.createServer(app)

app.use(cors())

const io = new Server(server, {
  cors: {
    origin: ['https://chatty-frontend-l4it.onrender.com', 'http://2.68.181.236:3000'],
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {

  socket.on('join room', ({ username, room }) => {
    socket.join(room)
    const user = userJoin(socket.id, username, room)
    io.to(user.room).emit('chat message', formatMessage('ChattyBot', `User ${user.username} joined the room.`))
    io.to(user.room).emit('room users', getUsersInRoom(user.room))
  })

  socket.on('chat message', (message) => {
    const user = getUserById(socket.id)
    if (user) {
      io.to(user.room).emit('chat message', formatMessage(user.username, message.text))
    }
  })

  socket.on('leave room', () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('chat message', formatMessage('ChattyBot', `User ${user.username} left the room.`))
      io.to(user.room).emit('room users', getUsersInRoom(user.room))
    }
  })

  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('chat message', formatMessage('ChattyBot', `User ${user.username} left the room.`))
      io.to(user.room).emit('room users', getUsersInRoom(user.room))
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})