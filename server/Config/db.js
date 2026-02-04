// Code for setting up database connection
const mongoose = require("mongoose"); // Import mongoose for the database
require('dotenv').config(); // Load environment variables from .env file
const uri = process.env.URI;


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = async () =>{
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;