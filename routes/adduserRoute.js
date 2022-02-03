const express = require("express");
const { createUser, showUser, editUser, deleteUser, updateUser } = require("../controller/addUser");
const auth = require("../middleware/auth");



const router = express.Router();

const { check, body } = require("express-validator");

const userTable = require("../model/user");



router.post("/addUser",
    body("username").isString().isLength({ min: 3, max: 15 })
        .withMessage("Username is Required and it must be 4 character"),
    check("email").isEmail().withMessage("Please Enter Valid Email")
        .normalizeEmail().custom(value => {
            return userTable.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject("E-mail Already Exist pickup  different one")
                }
            })
        }),
    body("about").isLength({ min: 3, max: 300 }).withMessage("About is required"),
    check("gender").not().isEmpty().withMessage("Gender is required").isIn(['M', 'F'])
    , auth, createUser);

router.get("/showUser", auth, showUser);

router.get("/editUser/:id", auth, editUser);

router.put("/updateUser/:id", auth, updateUser)

router.delete("/deleteUser/:id", auth, deleteUser);


module.exports = router;