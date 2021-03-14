const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupname:{
        name: String,
    }
})

module.exports = mongoose.model("Group", groupSchema)