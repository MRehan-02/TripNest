const joi = require('joi');

module.exports.listingSchema = joi.object(
    {
        listing: joi.object({
            title: joi.string().required(),
            description: joi.string().required(),
            location: joi.string().required(),
            country: joi.string().required(),
            price: joi.number().required().min(0),
            category: joi.string().valid("trending", "rooms", "cities", "mountains", "castles", "arctic", "camping", "farms", "pools", "domes", "boats"),
            image: joi.string().allow("", null)
        }).required()
    }
)

module.exports.reviewSchema = joi.object(
    {
        review: joi.object({
            rating: joi.number().required().min(1).max(5),
            comment: joi.string().required()
        }).required()
    }
)

module.exports.signupSchema = joi.object({
    username: joi.string().trim().min(3).max(30).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.any().valid(joi.ref("password")).required()
        .messages({ "any.only": "Passwords do not match" }),
    role: joi.string().valid("owner", "user").required()
}).required()


module.exports.bookingSchema = joi.object({
    booking: joi.object({
        checkIn: joi.date().iso().required(),
        checkOut: joi.date().iso().greater(joi.ref("checkIn")).required()
            .messages({ "date.greater": "Check-out must be after check-in" }),
        guests: joi.number().integer().min(1).max(10).required()
    }).required()
})
