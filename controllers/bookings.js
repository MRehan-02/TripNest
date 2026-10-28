const Booking = require("../models/booking");
const Listing = require("../models/listing");

const GST_RATE = 0.18;
const DAY_MS = 24 * 60 * 60 * 1000;

// user: book a listing
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut, guests } = req.body.booking;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (inDate < today) {
        req.flash("error", "Check-in date cannot be in the past.");
        return res.redirect(`/listings/${id}`);
    }

    const nights = Math.round((outDate - inDate) / DAY_MS);
    if (nights < 1 || nights > 30) {
        req.flash("error", "You can book between 1 and 30 nights.");
        return res.redirect(`/listings/${id}`);
    }

    // double-booking check: same listing, overlapping dates, not cancelled
    const clash = await Booking.findOne({
        listing: id,
        status: { $in: ["Pending", "Confirmed"] },
        checkIn: { $lt: outDate },
        checkOut: { $gt: inDate }
    });
    if (clash) {
        req.flash("error", "Sorry, these dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${id}`);
    }

    const subtotal = nights * listing.price;
    const gst = Math.round(subtotal * GST_RATE);

    const booking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: inDate,
        checkOut: outDate,
        guests,
        nights,
        pricePerNight: listing.price,
        subtotal,
        gst,
        total: subtotal + gst
    });
    await booking.save();

    req.flash("success", "Booking request sent! Waiting for the owner to confirm.");
    res.redirect("/bookings");
}

// user: my bookings page
module.exports.myBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    res.render("bookings/index.ejs", { bookings });
}

// user: cancel own booking
module.exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking || !booking.user.equals(req.user._id)) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings");
    }
    if (booking.status === "Cancelled") {
        req.flash("error", "This booking is already cancelled.");
        return res.redirect("/bookings");
    }
    booking.status = "Cancelled";
    await booking.save();
    req.flash("success", "Booking cancelled.");
    res.redirect("/bookings");
}

// owner: dashboard with counts, earnings and all bookings on own listings
module.exports.dashboard = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id }).select("_id");
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing", "title")
        .populate("user", "username email")
        .sort({ createdAt: -1 });

    const stats = {
        totalListings: listings.length,
        totalBookings: bookings.length,
        pending: bookings.filter((b) => b.status === "Pending").length,
        confirmed: bookings.filter((b) => b.status === "Confirmed").length,
        // earnings = only confirmed bookings
        earnings: bookings.filter((b) => b.status === "Confirmed").reduce((sum, b) => sum + (b.total || 0), 0)
    };

    res.render("bookings/dashboard.ejs", { bookings, stats });
}

// owner: confirm or reject (cancel) a booking
module.exports.updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(bookingId).populate("listing");

    if (!booking || !booking.listing || !booking.listing.owner || !booking.listing.owner.equals(req.user._id)) {
        req.flash("error", "Booking not found for your listings.");
        return res.redirect("/dashboard");
    }
    if (!["Confirmed", "Cancelled"].includes(status)) {
        req.flash("error", "Invalid status.");
        return res.redirect("/dashboard");
    }
    if (booking.status === "Cancelled" || booking.status === status) {
        req.flash("error", `This booking is already ${booking.status}.`);
        return res.redirect("/dashboard");
    }
    booking.status = status;
    await booking.save();
    req.flash("success", status === "Confirmed" ? "Booking confirmed!" : "Booking rejected.");
    res.redirect("/dashboard");
}
