const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema, signupSchema, bookingSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // After login the browser does a GET, so never send the user back to a
        // POST/PUT/DELETE-only url. Send them to the listing page instead.
        if (req.method !== "GET") {
            req.session.redirectUrl = req.params.id ? `/listings/${req.params.id}` : "/listings";
        } else {
            req.session.redirectUrl = req.originalUrl;
        }

        req.flash('error', "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// ---- ROLE CHECKS ----
// owner (host) only: add / edit / delete listings
module.exports.isHost = (req, res, next) => {
    if (!req.user || req.user.role !== "owner") {
        req.flash("error", "Only owner accounts can do this. Please sign up as an Owner.");
        return res.redirect("/listings");
    }
    next();
}

// user (guest) only: add / edit / delete reviews
module.exports.isCustomer = (req, res, next) => {
    if (!req.user || req.user.role !== "user") {
        req.flash("error", "Only user accounts can do this (reviews, bookings, wishlist).");
        return res.redirect(req.params.id ? `/listings/${req.params.id}` : "/listings");
    }
    next();
}

// the listing must belong to the logged-in owner
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// the review must belong to the logged-in user
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review you requested does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateSignup = (req, res, next) => {
    let { error } = signupSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details.map((el) => el.message).join(', '));
        return res.redirect("/signup");
    }
    next();
}

module.exports.validateBooking = (req, res, next) => {
    let { error } = bookingSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details.map((el) => el.message).join(', '));
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
}
