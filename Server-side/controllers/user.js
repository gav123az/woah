const User = require('../models/User');

const bcrypt = require('bcryptjs');
const auth = require("../auth");
const { errorHandler } = require("../auth");
const sendEmail = require("../utils/sendEmail");
const validator = require('validator');

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, mobileNo, password } = req.body;
    if (!email || !email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
    }
    if (!firstName || typeof firstName !== "string" || !lastName || typeof lastName !== "string") {
        return res.status(400).send({ error: "Invalid name" });
    }
    if (!mobileNo || mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    if (!password || password.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).send({ error: "Duplicate email found" });
    }
    const newUser = new User({
        firstName,
        lastName,
        email,
        mobileNo,
        password: bcrypt.hashSync(password, 10)
    });
    return newUser.save()
        .then(async () => {
            try {
                await sendEmail({
                    to: email,
                    subject: "Registration Successful – E-Commerce App",
                    text: `Dear ${firstName},\n\nThank you for registering at E-Commerce App!\nYou can now log in with your email address.\nIf you did not register, please contact support immediately.`,
                });
            } catch (emailErr) {
            }
            return res.status(201).send({ message: "Registered Successfully" });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
    }
    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "No Email Found" });
            }
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ error: "Email and password do not match" });
            }
            return res.status(200).send({ access: auth.createAccessToken(user) });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.getProfile = (req, res) => {
    const userId = req.user && (req.user.id || req.user._id);
    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            let { firstName, lastName, email, isAdmin, mobileNo, _id, __v } = user;
            return res.status(200).send({
                user: { _id, firstName, lastName, email, isAdmin, mobileNo, __v }
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.resetPassword = (req, res) => {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) {
        return res.status(400).send({ error: "User ID not found" });
    }
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    }
    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            if (!validator.isEmail(user.email)) {
                return res.status(400).send({ error: "User email invalid, cannot send update." });
            }
            if (bcrypt.compareSync(newPassword, user.password)) {
                return res.status(200).send({ message: "Password already reset" });
            }
            user.password = bcrypt.hashSync(newPassword, 10);
            user.passwordChangedAt = Date.now();
            return user.save()
                .then(async () => {
                   
                    try {
                        await sendEmail({
                            to: user.email,
                            subject: "Your Password Was Updated – E-Commerce App",
                            text: `Hello ${user.firstName},\n\nYour password was recently updated successfully.\nIf you did not make this change, please contact support immediately.`,
                        });
                    } catch (emailErr) {
                        console.error("Password update email failed:", emailErr);
                    }
                    return res.status(201).send({ message: "Password reset successfully" });
                });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.setAsAdmin = (req, res) => {
    const userId = req.params.id;
    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not Found" });
            }
            if (user.isAdmin) {
                return res.status(200).send({ message: "User already admin"});
            }
            user.isAdmin = true;
            return user.save()
                .then(updatedUser => res.status(200).send({ updatedUser }));
        })
        .catch(error => errorHandler(error, req, res));
};
