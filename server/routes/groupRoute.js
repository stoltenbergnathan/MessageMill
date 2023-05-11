const express = require("express");
const groupRouter = express.Router();
const path = require("path");
require("dotenv").config();
const parser = require("body-parser");
groupRouter.use(parser.urlencoded({ extended: true }));
const Group = require("../models/Group");
const Message = require("../models/Message");
const ensureAuthenticated = require("../middleware").ensureAuthenticated;

// Get the list of groups
groupRouter.get("/groups", ensureAuthenticated, (req, res) => {
  Group.find()
    .exec()
    .then((groupList) => res.send(groupList))
    .catch((err) => res.status(500).send(err));
});

groupRouter.get("/groupchat", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "groupchat.html"));
});

// Get messages for a group ID
groupRouter.get("/groupMessages", ensureAuthenticated, (req, res) => {
  var groupID = req.query["group"];
  Message.find()
    .where({ room: groupID })
    .exec()
    .then((messages) => res.send(messages))
    .catch((err) => res.send(err));
});

module.exports = groupRouter;
