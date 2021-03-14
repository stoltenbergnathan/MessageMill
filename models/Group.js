const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupname:{
        type: String,
    },
    messages: [String]
})

module.exports = mongoose.model("Group", groupSchema)