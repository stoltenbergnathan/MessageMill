const express = require("express");
const groupRouter = express.Router();
const path = require("path");
require("dotenv").config();
const parser = require("body-parser");
groupRouter.use(parser.urlencoded({ extended: true }));
const Group = require("../models/Group");
const Message = require("../models/Message");

// Get the list of groups
groupRouter.get("/groups", (req, res) => {
  Group.find()
    .exec()
    .then((groupList) => res.send(groupList))
    .catch((err) => res.status(500).send(err));
});

groupRouter.post("/group", (req, res) => {});

groupRouter.get("/groupchat", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "groupchat.html"));
});

// Get messages for a group ID
groupRouter.get("/groupMessages:id", (req, res) => {});

module.exports = groupRouter;
