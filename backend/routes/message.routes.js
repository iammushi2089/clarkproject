const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// POST /api/messages - Public route to submit a contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Fix: Force email to lowercase and remove accidental spaces
    const cleanEmail = email.trim().toLowerCase();
    
    const newMessage = await Message.create({ name, email: cleanEmail, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user's own messages/replies based on email
router.get('/my-messages', protect, async (req, res) => {
  try {
    // Fix: Use a case-insensitive RegEx search to ensure older messages 
    // with weird uppercase letters still match the logged-in user.
    const userEmail = req.user.email.trim();
    const messages = await Message.find({ 
        email: { $regex: new RegExp('^' + userEmail + '$', 'i') } 
    }).sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;