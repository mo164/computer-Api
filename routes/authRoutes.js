const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controller/authController");

router.get("/google", authController.loginWithGoogle);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.googleCallback
);

router.post("/signup",authController.signUp)
module.exports = router;
