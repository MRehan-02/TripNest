const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isHost, isCustomer, validateBooking } = require("../middleware.js");

const bookingController = require("../controllers/bookings.js");

// ---- USER (customer) ----
// book a listing
router.post("/listings/:id/bookings", isLoggedIn, isCustomer, validateBooking, wrapAsync(bookingController.createBooking));

// my bookings
router.get("/bookings", isLoggedIn, isCustomer, wrapAsync(bookingController.myBookings));

// cancel my booking
router.put("/bookings/:bookingId/cancel", isLoggedIn, isCustomer, wrapAsync(bookingController.cancelBooking));

// ---- OWNER (host) ----
// dashboard: counts, earnings and all bookings on my listings
router.get("/dashboard", isLoggedIn, isHost, wrapAsync(bookingController.dashboard));

// confirm or reject a booking
router.put("/bookings/:bookingId/status", isLoggedIn, isHost, wrapAsync(bookingController.updateBookingStatus));

module.exports = router;
