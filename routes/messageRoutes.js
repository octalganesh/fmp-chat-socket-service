const express = require('express');
const { protect } = require('../middleware/auth');
const { getChatHistory, chatPartners } = require('../controllers/messageController');

const router = express.Router();

router.get('/:otherUserId', protect, getChatHistory);
router.get('/chat-partners',protect, chatPartners)

module.exports = router;