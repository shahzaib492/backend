const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
    },
    strength: {
        type: Array,
    },
    platform:{
        type:String,
        default:"local"
    }
})

const userTable = mongoose.model("user", userSchema);

module.exports = userTable;