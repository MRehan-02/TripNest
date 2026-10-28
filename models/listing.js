const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    category: {
        type: String,
        enum: ["trending", "rooms", "cities", "mountains", "castles", "arctic", "camping", "farms", "pools", "domes", "boats"],
        default: "rooms"
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [74.2433, 16.7050]
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;