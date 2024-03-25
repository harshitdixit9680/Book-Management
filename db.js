const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://user2000:test123@cluster0.zxuttun.mongodb.net/hotel?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(mongoURI);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
module.exports = connectToMongo;
