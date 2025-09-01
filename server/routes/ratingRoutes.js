const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, ratingController.createRating);

module.exports = router;