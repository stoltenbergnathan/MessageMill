const express = require("express");
const userRouter = express.Router();
const passport = require("./passport").passport;
const userModel = require("./passport").userModel;
const path = require("path");
require("dotenv").config();
const parser = require("body-parser");
userRouter.use(parser.urlencoded({ extended: true }));

userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

userRouter.post("/register", (req, res) => {
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
  res.redirect("/");
});

module.exports = userRouter;
