const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var user = { name: String, messages: [String] };

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
  },
  password: {
    type: String,
  },
  contacts: [user],
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
