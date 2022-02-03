const express = require("express");

const app = express();

const cors = require("cors");

const adminRoute = require("./routes/adminRoute")

const userRoute = require("./routes/userRoute")

const addUserRoute=require("./routes/adduserRoute");

require('dotenv').config()


const mongodb=require("./db/db");
const auth = require("./middleware/auth");

app.use(cors())


app.use(express.json());

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/add",addUserRoute);

app.use("*",(req,res,next)=>{
    res.json({
        message:"Not found"
    })
})

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log("Listening at Port no", PORT);
})