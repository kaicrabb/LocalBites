/*
    * This file defines a function to create a demo user for testing purposes.
    * The function checks if a demo user with a specific email already exists in the database, and if not, it creates a new user with predefined credentials.
    * This function can be used to populate the database with a sample user for testing authentication and user-related features of the application.
    * The function is exported for use in other parts of the application, such as in a script to initialize the database with demo data.
*/

const User = require('../Models/user');

async function runDemo() {
  try {
    // Check if demo user already exists
    const exists = await User.findOne({ email: 'chris@example.com' });
    if (!exists) {
      const demoUser = new User({
        Username: 'Chris',
        Email: 'chris@example.com',
        Password: '123584583aQMAOWE'
      });
      await demoUser.save();
      console.log('Demo user created!');
    } else {
      console.log('Demo user already exists.');
    }
  } catch (err) {
      //console.error('Error in demo user:', err);
  }
}

module.exports = runDemo;