const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
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
        const { username, email, password, gender, about, strength } = req.body;
        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            name: username,
            email: email,
            password: hash,
            gender: gender,
            about: about,
            strength: strength
        })

        const savedAdmin = await user.save();
        res.status(201).json({
            message: "User Registred"
        })

    } catch (error) {
        console.log(error);
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
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
        const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, process.env.JWT_KEY, {
            expiresIn: "1h"
        })
        res.status(200).json({
            message: "user Login",
            expiresIn: 3600,
            token: token,
            role: user.role,
            userId: user._id,
            name:user.name
        })
    } catch (error) {
        console.log(error)
    }
}


exports.LoginWithGoogle = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            const newUser = new User({
                name: name,
                email: email,
                platform: "google"
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({ email: savedUser.email, userId: savedUser._id, role: savedUser.role }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            res.status(200).json({
                message: "Successfully Login With google",
                expiresIn: 3600,
                token: token,
                role: savedUser.role,
                userId: savedUser._id,
                name:name
            })
        } else {
            const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            res.status(200).json({
                message: "Successfully Login With google",
                expiresIn: 3600,
                token: token,
                role: user.role,
                userId: user.id,
                name:name
            })
        }
    } catch (error) {
        console.log(error);
    }
}


exports.LoginWithFacebook = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            const newUser = new User({
                name: name,
                email: email,
                platform: "facebook"
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({ email: savedUser.email, userId: savedUser._id, role: savedUser.role }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            res.status(200).json({
                message: "Successfully Login With Facebook",
                expiresIn: 3600,
                token: token,
                role: savedUser.role,
                userId: savedUser._id,
                name:name
            })
        } else {
            const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            res.status(200).json({
                message: "Successfully Login With Facebook",
                expiresIn: 3600,
                token: token,
                role: user.role,
                userId: user._id,
                name:name

            })

        }


    } catch (error) {
        console.log(error);
    }
}


exports.allUser = async (req, res, next) => {
    try {
        const allUser = await User.find();
        res.status(200).json({
            message: "User Fetched",
            user: allUser
        })
    } catch (error) {
        console.log(error);
    }
}