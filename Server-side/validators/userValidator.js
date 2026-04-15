const { body, validationResult } = require("express-validator");

exports.validateRegister = [

    body("firstName").notEmpty().withMessage("First name is Required"),
    body("lastName").notEmpty().withMessage("Last Name is Required"),
    body("email").isEmail().withMessage("Email is Invalid"),
    body("mobileNo").isLength({min: 11, max: 11}).withMessage("Mobile Number must be exactly 11 digits"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters long"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        next();

    }
];

exports.validateLogin = [
    body("email").isEmail().withMessage("Email is Invalid"),
    body("password").isLength({min: 8}).withMessage("Password must be at least 8 characters long"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        next();

    }
];
