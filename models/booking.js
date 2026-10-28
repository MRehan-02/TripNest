const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    nights: Number,
    pricePerNight: Number,
    subtotal: Number,   // nights x price
    gst: Number,        // 18% of subtotal
    total: Number,      // subtotal + gst
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
