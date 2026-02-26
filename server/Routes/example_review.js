const Review     = require('../Models/reviews');
const User       = require('../Models/user');
const Restaurant = require('../Models/places');

async function runDemoReview() {
  try {
    let user = await User.findOne({ Email: 'chris@example.com' });
    if (!user) { throw new Error('Demo user not found'); }

    let place = await Restaurant.findOne({ displayName: 'Raku Hibachi Sushi & Ramen' });
    if (!place) { throw new Error('Demo restaurant not found'); }

    const existing = await Review.findOne({ User: user._id, Place: place._id });
    if (!existing) {
      const review = new Review({
        User: user._id,
        Place: place._id,
        Comment: 'Sample review',
        Rating: 5
      });
      await review.save();
      console.log('Demo review created:', review);
    } else {
      console.log('Demo review already exists:', existing);
    }
  } catch (err) {
    console.error('Error in demo review:', err);
  }
}

module.exports = runDemoReview;