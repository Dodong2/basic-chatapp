require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

/* Middleware */
app.use(express.json())
app.use(cors())
/* for deployment later */
app.use(cors({
    origin: 'https://chatapp-carl.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


/* socket.io */
const http = require('http')
const { Server } = require('socket.io')



/* CORS */
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://chatapp-carl.netlify.app",
        methods: ["GET", "POST"]
    }
})

const PORT = process.env.PORT || 3000
const MONGOURI = process.env.MONGOURI

server.listen(PORT, () => {
  console.log('running on port:', PORT)
})

const chatRoutes = require('./routes/Chat')
app.use('/chat', chatRoutes)


mongoose.connect(MONGOURI).then(() =>{
    console.log('Connected to the Database')
}).catch((err) => {
    console.log('Failed to connect to the Database!', err)
}) 

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)
  
    socket.on("sendMessage", async (data) => {
      console.log("Message received:", data)
      
      // Save message to DB
      try {
        const newMessage = new (require('./model/ChatModel'))({ message: data })
        await newMessage.save()
        io.emit("receiveMessage", data)
      } catch (err) {
        console.error("Error saving message:", err)
      }
    })
    
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })