const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const { randomBytes } = require("crypto");
const { validationResult } = require("express-validator/check");


const nodeMailer = require("nodemailer");

let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "shazaibrehman127@gmail.com",
        pass: "auwctfvtbqzivakr",
    },
});


exports.createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const { username, email, gender, about,strength } = req.body;
        const password = randomBytes(4).toString('hex');
        const hash = await bcrypt.hash(password, 10);
        const user = new User({
            name: username,
            email: email,
            password: hash,
            gender: gender,
            about: about,
            strength:strength
        })
        const savedUser = await user.save();
        let mailDetails = {
            from: "shazaibrehman127@gmail.com",
            to: user.email,

            subject: ` Welcome ${user.name} your Credentials are : -`,
            html: `

            <div   style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            max-width: 300px;
            margin: auto;
            text-align: center;
            font-family: arial;"  >
                  <h1> ${(user.gender==='M')?'Mr':'Mrs'} ${user.name}</h1>
                    <p style="color: grey;
                    font-size: 10px;">Email :- ${user.email}</p>
                    <p style="color: grey;
                    font-size: 10px;">Password :- ${password}</p>
                    <p>From @User Profile</p> 
            </div>

                    `,
        };

        mailTransporter.sendMail(mailDetails);

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


exports.showUser = async (req, res, next) => {
    try {
        const allUser = await User.find();
        res.status(200).json({
            message: "allUser Fetched",
            allUser: allUser
        })
    } catch (error) {
        console.log(error)
    }
}


exports.editUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        res.status(200).json({
            message: "user fetched",
            user: user
        })

    } catch (error) {
        res.status(500).json({
            message: "User not Found"
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, email, gender, about,strength } = req.body;
        const user = await User.findOne({ _id: id });
        if (user) {
            user.name = name;
            user.email = email;
            user.password;
            user.gender = gender;
            user.about = about;
            user.strength=(strength.length > 0)?strength:user.strength;
        }
        const updatedUser = await user.save();
        res.status(201).json({
            message: "user Modified"
        })
    } catch (error) {
        console.log(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.deleteOne({ _id: id });
        res.status(201).json({
            message: "User Deleted"
        })
    } catch (error) {
        console.log(error);
    }
}
