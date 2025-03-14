const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// GET all messages (no authentication required)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST a new message (no authentication required)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      user: userId || null, // Include userId if the user is logged in
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST mark a message as resolved (no authentication required)
router.post('/:id/resolve', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.resolved = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;