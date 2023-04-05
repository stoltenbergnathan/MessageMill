const passport = require("passport");
const userModel = require("../models/Users");

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports = { passport: passport, userModel: userModel };
