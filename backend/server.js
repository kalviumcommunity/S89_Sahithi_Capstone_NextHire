const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create HTTP server
const server = http.createServer(app);

// Database connection
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  console.log("Server will continue without database connection for testing...");
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
    }
    next();
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure uploads directory exists (if you need it for other endpoints)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Import routers
const authRouter = require('./controller/authRouter');
const userRouter = require('./controller/userRouter');
const chatRouter = require('./controller/chatRouter');
const postRouter = require('./controller/postRouter');
const resumeReviewRouter = require('./controller/resumeReviewRouter');
const aiInterviewRouter = require('./controller/AiInterviewRouter');
const companyWiseQuestionsRouter = require('./controller/companyWiseQuestionsRouter');
const jobBoardRouter = require('./controller/jobBoardRouter');
const companyQuestionsRouter = require('./controller/companyQuestionsRouter');

// Use routers
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/posts', postRouter);
app.use('/api', resumeReviewRouter);
app.use('/api', aiInterviewRouter);
app.use('/api', companyWiseQuestionsRouter);
app.use('/api', jobBoardRouter);
app.use('/api/companies', companyQuestionsRouter);

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:3000'], // React dev server
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('./models/userSchema');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User ${socket.username} connected`);

  // Store user connection
  connectedUsers.set(socket.userId, socket.id);

  // Update user online status
  const User = require('./models/userSchema');
  User.findByIdAndUpdate(socket.userId, {
    isOnline: true,
    lastSeen: new Date()
  }).exec();

  // Join user to their personal room
  socket.join(socket.userId);

  // Broadcast user online status
  socket.broadcast.emit('user_online', { userId: socket.userId });

  // Send current online users to the new user
  const onlineUserIds = Array.from(connectedUsers.keys());
  socket.emit('online_users', { userIds: onlineUserIds });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      const Message = require('./models/messageSchema');

      // Create and save message
      const message = new Message({
        sender: socket.userId,
        receiver: receiverId,
        content,
        messageType
      });

      await message.save();
      await message.populate('sender', 'username fullName profilePicture');

      // Send to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', message);
      }

      // Confirm to sender
      socket.emit('message_sent', message);
    } catch (error) {
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        userId: socket.userId,
        username: socket.username
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const { receiverId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_stopped_typing', {
        userId: socket.userId
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
    connectedUsers.delete(socket.userId);

    // Broadcast user offline status
    socket.broadcast.emit('user_offline', { userId: socket.userId });

    // Update user offline status
    User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date()
    }).exec();
  });
});

// Error handler (optional, but good practice)
app.use((err, req, res, next) => {
  res.status(400).json({ feedback: err.message });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});