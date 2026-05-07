const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connection to DB Successfull !!");
  } catch (e) {
    console.error("Connection to DB Failed !!", e);
    process.exit(1);
  }
};

module.exports = connectDB;
