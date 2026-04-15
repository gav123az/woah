const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require('dotenv').config();

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    if(typeof token === "undefined") {
        return res.send({ auth: "Authentication Failed. No Token."});
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, process.env.JWT_SECRET_KEY, async function(err, decodedToken) {
            if(err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                try {
                    const User = require("./models/User");
                    const user = await User.findById(decodedToken.id);
                    if (user && user.passwordChangedAt) {
                        const passwordChangedAt = parseInt(new Date(user.passwordChangedAt).getTime() / 1000, 10);
                        if (decodedToken.iat < passwordChangedAt) {
                            return res.status(401).send({
                                auth: "Failed",
                                message: "Token expired due to password change. Please log in again."
                            });
                        }
                    }
                } catch (checkErr) {
                    return res.status(500).send({
                        auth: "Failed",
                        message: "Internal error during token validation."
                    });
                }
                req.user = decodedToken;
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
};

module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};

module.exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});
