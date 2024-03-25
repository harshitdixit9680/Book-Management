const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
   name :{
    type : String,
    required : true
   },
   email :{
    type : String,
    required : true,
    unique :true
   },
   password :{
    type : String,
    required : true
   },
   date :{
    type :Date,
    default:Date.now
   }
  });

  const User = mongoose.model('user',UserSchema);
  // User.createIndexes();
  module.exports =  User;


//   http://localhost:3000/api/auth



// {
//     "name":"harshit",
//     "email" : "govinddixit9680a@gmail.com",
//     "password" : "6584646464"
//   }