const { body, validationResult } = require("express-validator");

exports.validateCreateProduct = [
body("name")
    .notEmpty().withMessage("Product name cannot be empty")
    .isLength({ min: 5 }).withMessage("Product name must be at least 5 characters long"),
    body("description").notEmpty().withMessage("Product description cannot be empty")
    .isLength({ min: 5 }).withMessage("Product description must be at least 5 characters long"),
    body("price")
        .notEmpty().withMessage("Product price is required")
        .isFloat({ gt: 0 }).withMessage("Product price must be a positive number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

exports.validateUpdateProduct = [
body("name")
    .notEmpty().withMessage("Product name cannot be empty")
    .isLength({ min: 5 }).withMessage("Product name must be at least 5 characters long"),
    body("description").notEmpty().withMessage("Product description cannot be empty")
    .isLength({ min: 5 }).withMessage("Product description must be at least 5 characters long"),
    body("price")
        .isFloat({ gt: 0 }).withMessage("Product price must be a positive number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

exports.validateSearchByName = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be longer than 3 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

exports.validateSearchByPriceRange = [
    body().custom(body => {
        if (body.minPrice === undefined && body.maxPrice === undefined) {
            throw new Error("At least one of 'minPrice' or 'maxPrice' is required.");
        }
        return true;
    }),
    body("minPrice").optional().custom((value) => {
        if (typeof value !== "number" || isNaN(value)) throw new Error("'minPrice' must be a number and not a string.");
        if (value < 0) throw new Error("'minPrice' cannot be negative.");
        return true;
    }),
    body("maxPrice").optional().custom((value) => {
        if (typeof value !== "number" || isNaN(value)) throw new Error("'maxPrice' must be a number and not a string.");
        if (value < 0) throw new Error("'maxPrice' cannot be negative.");
        return true;
    }),
    body().custom(body => {
        if (
          body.minPrice !== undefined
          && body.maxPrice !== undefined
          && Number(body.minPrice) > Number(body.maxPrice)
        ) {
            throw new Error("'minPrice' cannot be greater than 'maxPrice'.");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
