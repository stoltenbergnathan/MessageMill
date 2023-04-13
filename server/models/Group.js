const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Group", groupSchema);
