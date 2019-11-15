var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    message : String,
    date: {
        type: Date,
        default: Date.now
    },
    sender  : {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
    },
    receiver : {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
});

module.exports = mongoose.model("Message", MessageSchema);