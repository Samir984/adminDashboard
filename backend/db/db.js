const mongoose = require("mongoose");

console.log(process.env.DB_URL)
async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DB_URL);
    console.log("Database connection established successfully.\n\n");
    return connect;
  } catch (err) {
    console.log("Database connection failed! \n\n", err);
    return null; // return null or false if connection fails
  }
}

module.exports = connectDB;
