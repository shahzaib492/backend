const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../model/admin");

const { validationResult } = require("express-validator/check");

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const { username, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = new Admin({
            username: username,
            email: email,
            password: hash
        })

        const savedAdmin = await user.save();
        res.status(201).json({
            message: "Admin Registred"
        })

    } catch (error) {
        res.status(401).json({
            message: "Unathourised"
        })
    }
}


exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
        if (!(admin.role === "admin")) {
            return res.status(401).json({
                message: "Authentication Failed"

            })
        }
        const result = await bcrypt.compare(password, admin.password);
        if (!result) {
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
        const token = jwt.sign({ email: admin.email, userId: admin._id, role: admin.role }, process.env.JWT_KEY, {
            expiresIn: "1h"
        })

        res.status(200).json({
            message: "Admin Registred",
            expiresIn: 3600,
            token: token,
            role:admin.role
        })
    } catch (error) {
        console.log(error)
    }
}
