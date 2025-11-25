const express = require('express');
const { protect } = require('../middleware/auth');
const { getChatHistory } = require('../controllers/messageController');

const router = express.Router();

router.get('/:otherUserId', protect, getChatHistory);

module.exports = router;