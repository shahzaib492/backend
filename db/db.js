const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Connected To the Database");
}).catch((e) => {
    console.log(e);
})