const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isCustomer, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Reviews are only for "user" accounts (owners cannot review)

// post review
router.post("/", isLoggedIn, isCustomer, validateReview, wrapAsync(reviewController.createReview));

// edit review form
router.get("/:reviewId/edit", isLoggedIn, isCustomer, isReviewAuthor, wrapAsync(reviewController.renderEditForm));

// update review
router.put("/:reviewId", isLoggedIn, isCustomer, isReviewAuthor, validateReview, wrapAsync(reviewController.updateReview));

// Delete review
// MongoDB Operator: $pull removes a value from an array
router.delete("/:reviewId", isLoggedIn, isCustomer, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
