const express = require("express");
const { login, register } = require("../controller/admin");

const router = express.Router();

const { check, body } = require("express-validator");
const adminTable = require("../model/admin");
const req = require("express/lib/request");

router.post("/register",
    check("email").isEmail().withMessage("Please Enter Valid Email")
        .normalizeEmail().custom(value => {
            return adminTable.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject("E-mail Already Exist pickup  different one")
                }
            })
        }),
    body("password").isLength({ min: 5 }).withMessage("Please Entewr valid password length must be 5 character")
        .trim(),
    body("cpassword").trim().custom((value,{req}) => {
        if (value !== req.body.password) {
            throw new Error("Password have to match");
        }
        return true;
    })
    ,
    register);

router.post("/login",
    check("email").isEmail().withMessage("Please Enter Valid Email")
        .normalizeEmail().custom(value => {
            return adminTable.findOne({ email: value }).then(userDoc => {
                if (!userDoc) {
                    return Promise.reject("E-mail does'nt exist please register or contact your admin")
                }
            })
        }),
    body("password").isLength({ min: 5 }).withMessage("Please Entewr valid password length must be 5 character")
        .trim(),
    login);









module.exports = router;