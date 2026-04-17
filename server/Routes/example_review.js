/*
    * This file defines a function to create a demo review for testing purposes.
    * The function checks for the existence of a demo user and a demo restaurant in the database, and if they exist, it creates a review linking the user to the restaurant with a sample comment and rating.
    * This function can be used to populate the database with a sample review for testing the review-related features of the application.
    * The function is exported for use in other parts of the application, such as in a script to initialize the database with demo data.
*/

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