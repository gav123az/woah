const express = require('express');
const userController = require('../controllers/user');
const { verify } = require("../auth");
const router = express.Router();
const {validateRegister, validateLogin} = require("../validators/userValidator");
const {loginLimiter} = require("../auth");



router.post("/register", validateRegister, userController.registerUser);

router.post("/login", loginLimiter, validateLogin, userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch("/update-password", verify, userController.resetPassword);

router.patch("/:id/set-as-admin", verify, require("../auth").verifyAdmin, userController.setAsAdmin);

module.exports = router;
