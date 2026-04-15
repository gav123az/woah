const { body, validationResult } = require("express-validator");

exports.validateUpdateOrderStatus = [
    body("status")
        .notEmpty().withMessage("Status is required")
        .custom((value) => {
            if (typeof value !== "string") return false;
            const allowed = ["pending", "completed", "cancelled"];
            return allowed.includes(value.toLowerCase());
        })
        .withMessage("Status must be Pending, Completed, or Cancelled"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
