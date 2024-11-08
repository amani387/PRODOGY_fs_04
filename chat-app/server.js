const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const Message = require('./models/Message');
const cors = require('cors');
const groupRoutes =require('./routes/groupRoutes')
const privateChatRoutes = require('./routes/privateChat');
const { trusted } = require('mongoose');



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001', // Allow requests from the frontend
    methods: ['GET', 'POST'], // Allow specific methods
    credentials: true // If you're using cookies with sockets
  }
});
// Enable CORS for all origins
// Enable CORS for all origins (for Express HTTP routes)
app.use(cors({
  origin: '*',  // Allows requests from any origin
  methods: ['GET', 'POST'],
  credentials: true
}));
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use('/uploads', express.static('uploads'));
app.use('/api/group', groupRoutes);
app.use('/api/private-chat', privateChatRoutes);  // Register the new group routes
// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for users joining rooms
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });


//Group chat socket controler
  socket.on('group message',async(msgData)=>{
    try {
      const message = await Message.create({
        room:msgData.groupId,
        sender:msgData.sender,
        message:msgData.message,
        timestamp:new Data(),
      });
      io.to(msgData.groupId).emit('group message',message);

    } catch (error) {
      console.error('Error saving Group Messages ',error)
    }

  });


  
  // Listen for private messages and save to the database
  socket.on('private message', async ({ message, chatId, sender }) => {
    try {
      const newMessage = await Message.create({ chatId, sender, message });
      io.to(chatId).emit('private message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
