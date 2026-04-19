require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// 1. Import all the route files we created
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const messageRoutes = require('./routes/message.routes');
const app = express();

// Connect to MongoDB Atlas
connectDB();

// 2. Middleware (Updated CORS for Vite's port 5174)
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());

// 3. Serve uploaded image files publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Mount the API Routes so the frontend can reach them
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('TheFolio API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));