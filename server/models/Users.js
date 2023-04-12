const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    validate: (val) => {
      mongoose
        .model("User")
        .estimatedDocumentCount({ username: val }, (err, count) => {
          if (err) {
            return done(err);
          }
          done(!count);
        });
    },
  },
  password: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
