// Run from the project folder:  node init/index.js
// Adds 20 demo listings (Kolhapur, Sangli, Miraj, Ichalkaranji and nearby)
// with a demo owner and demo reviews. Uses the same database as your .env.
const dns = require("dns");
dns.setServers(["8.8.8.8"]);
require("dotenv").config();

const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASEDB_URL || "mongodb://127.0.0.1:27017/TripNest";

// demo accounts (password for all: demo1234)
const DEMO_OWNER = { username: "demo_owner", email: "demo.owner@tripnest.com", role: "owner" };
const DEMO_GUESTS = [
    { username: "demo_user", email: "demo.user@tripnest.com", role: "user" },
    { username: "demo_guest", email: "demo.guest@tripnest.com", role: "user" }
];
const COMMENTS = [
    "Clean rooms and friendly staff. Good value for the price.",
    "Great location, easy to reach. Would stay again.",
    "Comfortable stay, quiet at night. Breakfast was nice.",
    "Nice place for a family trip. Host was helpful.",
    "Good stay overall, rooms were as shown in the photos."
];

async function findOrCreateUser(info) {
    let user = await User.findOne({ email: info.email });
    if (!user) {
        user = await User.register(new User(info), "demo1234");
    }
    return user;
}

const initDB = async () => {
    await mongoose.connect(MONGO_URL);
    console.log("connection build successfuly");

    const owner = await findOrCreateUser(DEMO_OWNER);
    const guests = [];
    for (const g of DEMO_GUESTS) guests.push(await findOrCreateUser(g));

    // remove only the old DEMO listings (your own listings stay safe)
    const oldListings = await Listing.find({ owner: owner._id });
    const oldReviewIds = oldListings.flatMap((l) => l.reviews);
    await Review.deleteMany({ _id: { $in: oldReviewIds } });
    await Listing.deleteMany({ owner: owner._id });

    let index = 0;
    for (const obj of initData.data) {
        const listing = new Listing({ ...obj, owner: owner._id });
        // two demo reviews per listing so the star rating shows on the cards
        for (let g = 0; g < guests.length; g++) {
            const review = new Review({
                rating: ((index + g * 2) % 3) + 3,   // 3, 4 or 5
                comment: COMMENTS[(index + g) % COMMENTS.length],
                author: guests[g]._id
            });
            await review.save();
            listing.reviews.push(review);
        }
        await listing.save();
        index++;
    }

    console.log(`${initData.data.length} demo listings added`);
    console.log("Demo owner login : demo.owner@tripnest.com / demo1234");
    console.log("Demo user login  : demo.user@tripnest.com / demo1234");
    await mongoose.disconnect();
};

initDB().catch((err) => {
    console.log("error :", err);
    process.exit(1);
});
