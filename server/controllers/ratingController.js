const Rating = require('../models/Rating');
const User = require('../models/users');

exports.createRating = async (req, res) => {
  try {
    const { freelancerId, rating } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!freelancerId || !rating) {
      return res.status(400).json({ message: 'Freelancer ID and rating are required' });
    }

    // Allow decimal ratings between 1.0 and 5.0
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1.0 and 5.0' });
    }

    // Check if freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Check for existing rating
    const existingRating = await Rating.findOne({ freelancerId, userId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this freelancer' });
    }

    // Create new rating (allowing decimal values)
    const newRating = new Rating({
      freelancerId,
      userId,
      rating: parseFloat(rating) // Ensure it's stored as float
    });

    await newRating.save();
    
    // Calculate new average rating (with decimal precision)
    const ratings = await Rating.find({ freelancerId });
    const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / ratings.length;
    
    // Update freelancer with precise decimal rating
    await User.findByIdAndUpdate(freelancerId, { 
      rating: parseFloat(averageRating.toFixed(1)), // Store as float with 1 decimal
      ratingCount: ratings.length
    });

    res.status(201).json({ 
      success: true,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings: ratings.length
    });

  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};