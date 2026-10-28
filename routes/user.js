const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, validateSignup, isLoggedIn, isCustomer } = require("../middleware.js");

const userControllers = require("../controllers/users.js");

router
    .route("/signup")
    .get(userControllers.renderSignupForm)
    .post(validateSignup, wrapAsync(userControllers.signup));


router
    .route("/login")
    .get(userControllers.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: "Invalid email or password." }), userControllers.login);


// logout is POST so a random link cannot log someone out
router.post("/logout", userControllers.logout);

// wishlist (user accounts only)
router.get("/wishlist", isLoggedIn, isCustomer, wrapAsync(userControllers.renderWishlist));
router.post("/wishlist/:id", isLoggedIn, isCustomer, wrapAsync(userControllers.toggleWishlist));

module.exports = router;
