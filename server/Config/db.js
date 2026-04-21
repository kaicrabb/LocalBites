/*
  * This file is responsible for connecting to the MongoDB database using Mongoose.
  * It exports a function that can be called to establish the connection when the server starts.
  * The connection URI is stored in an environment variable for security reasons.
  * If the connection is successful, a success message is logged. If there is an error, it is logged and the process exits.
*/

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