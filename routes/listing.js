const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isHost, isOwner, validateListing } = require("../middleware.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");


router
    .route("/")
    .get(wrapAsync(listingController.index))
    // only owners can create listings
    .post(isLoggedIn, isHost, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// new Route (owner only)
router.get("/new", isLoggedIn, isHost, listingController.renderNewForm)

// owner's own listings (must stay above /:id)
router.get("/mine", isLoggedIn, isHost, wrapAsync(listingController.myListings));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    // only the owner of this listing can edit / delete it
    .put(isLoggedIn, isHost, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isHost, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isHost, isOwner, wrapAsync(listingController.editForm));

module.exports = router;
