const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
    // display name shown on reviews and listings
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // login id (email + password)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // owner = can add/edit/delete own listings, cannot review
    // user  = can review (add/edit/delete own reviews), cannot add listings
    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user"
    },
    // saved listings (heart icon) - only for "user" accounts
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
});

// users log in with email + password
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    usernameLowerCase: true
});

module.exports = mongoose.model("User", userSchema);
