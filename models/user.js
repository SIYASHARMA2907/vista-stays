//schema for user who sign up and log in

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //First you need to plugin Passport-Local Mongoose into your User schema

const userSchema = new Schema({
  //username and password will be add by Passport-Local Mongoose by default

  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
