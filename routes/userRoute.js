const express = require("express");
const { login, register, LoginWithGoogle, LoginWithFacebook, allUser } = require("../controller/user");
const userTable = require("../model/user");
const { check, body } = require("express-validator");

const router = express.Router();



router.post("/register",
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
    body("password").isLength({ min: 5 }).withMessage("Please Entewr valid password length must be 5 character")
        .trim(),
    body("cpassword").trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password have to match");
        }
        return true;
    }),
    check("gender").not().isEmpty().isIn(['M', 'F']).withMessage("Gender is required"),
    body("about").isLength({ min: 3, max: 300 }).withMessage("About is required"),
    register);

router.post("/login",

    check("email").isEmail().withMessage("Please Enter Valid Email")
        .normalizeEmail().custom(value => {
            return userTable.findOne({ email: value }).then(userDoc => {
                if (!userDoc) {
                    return Promise.reject("E-mail does'nt exist please register or contact your admin")
                }
            })
        }),
    body("password").isLength({ min: 5 }).withMessage("Please Entewr valid password length must be 5 character")
        .trim(), login);



router.post("/google", LoginWithGoogle);


router.post("/facebook", LoginWithFacebook);


router.get("/allUser", allUser);






module.exports = router;