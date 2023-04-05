const express = require("express");
const userRouter = express.Router();
const passport = require("./passport").passport;
const userModel = require("./passport").userModel;
const path = require("path");
const session = require("express-session");
require("dotenv").config();
const parser = require("body-parser");

userRouter.use(parser.urlencoded({ extended: true }));
userRouter.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
  })
);
userRouter.use(passport.initialize());
userRouter.use(passport.session());

userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

userRouter.post("/register", (req, res) => {
  console.log(req.body);
  userModel.register(
    new userModel({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.sendFile(path.join(__dirname, "..", "..", "login.html"));
      }
      passport.authenticate("local")(req, res, () => {
        res.sendFile(path.join(__dirname, "..", "..", "index.html"));
      });
    }
  );
});

userRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
  });
  res.sendFile(path.join(__dirname, "..", "..", "login.html"));
});

module.exports = userRouter;
