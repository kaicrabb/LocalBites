const express = require('express');
const bodyParser = require("body-parser"); // Import body-parser for middleware
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for tokenization
const bcrypt = require('bcryptjs'); // Import bcrypt for encryption
const mongoose = require("mongoose"); // Import mongoose for the database
const cors = require('cors'); // Importing cors module
require('dotenv').config(); // Load environment variables from .env file


const uri = process.env.URI
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); 

// mongoose.connect("mongodb://localhost:27017/userInfo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// // turn on the mongodb connection
// mongoose.connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

// // Define the schema for a user
// const contactSchema = new mongoose.Schema({
//     Username: { // requires users to create/have an account to login/signup
//         type: String, 
//         required: true, 
//         unique: true // Ensure the username is unique
//     },
//     Password: { // requires users to create/have a password to login/signup
//         type: String, 
//         required: true 
//     },
// })


app.listen(port, () => { 
    console.log("Server started on port " + port);
});


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);