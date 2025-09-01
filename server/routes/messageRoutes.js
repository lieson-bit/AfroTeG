const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.post('/', protect, uploadMiddleware.single('file'), messageController.sendMessage);
router.get('/', protect, messageController.getMessages);

module.exports = router;