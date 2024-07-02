const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

// auth/register
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);

// router.post("/auth/register",authController.register);


module.exports = router;

