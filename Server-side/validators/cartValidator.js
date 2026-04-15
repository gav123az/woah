const { body, validationResult } = require("express-validator");

exports.rejectAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return res.status(403).json({
            error: {
                message: "Admins are not allowed to access cart endpoints."
            }
        });
    }
    next();
};

exports.validateAddToCart = [
    body("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),
    body("quantity")
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateChangeQuantity = [
    body("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),
    body("newQuantity")
        .isInt({ min: 1 }).withMessage("New quantity must be at least 1"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
