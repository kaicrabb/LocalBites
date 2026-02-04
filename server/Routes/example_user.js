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
    console.error('Error in demo user:', err);
  }
}

module.exports = runDemo;