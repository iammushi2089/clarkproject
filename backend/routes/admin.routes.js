const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message'); // Our new Message model
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// All routes below require valid token AND admin role
router.use(protect, adminOnly);

// GET all members
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// PUT toggle member status (active/inactive)
router.put('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ message: `User is now ${user.status}`, user });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// GET all posts (including removed ones)
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// PUT remove post
router.put('/posts/:id/remove', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.status = 'removed';
    await post.save();
    res.json({ message: 'Post has been removed', post });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// ==========================================
// NEW: GET all messages for Admin Dashboard
// ==========================================
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT reply to a contact message
router.put('/messages/:id/reply', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    
    message.reply = req.body.reply;
    message.status = 'Resolved';
    await message.save();
    res.json({ message: 'Reply sent successfully', updatedMessage: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;