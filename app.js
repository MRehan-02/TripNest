const dns = require("dns");
dns.setServers(["8.8.8.8"]);

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);


const dbUrl = process.env.ATLASEDB_URL || "mongodb://127.0.0.1:27017/TripNest";
const sessionSecret = process.env.SECRET || "tripnestsecretkey";

main().then(() => {
    console.log("connection build successfuly");
}).catch((err) => {
    console.log("error :", err);
})

async function main() {
    await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: sessionSecret,
    },
    touchAfter: 24 * 3600
})
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
const sessionOption = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 day in millisecond
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    res.redirect("/listings");
})



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/signup",async (req,res)=>{
//     let fackUser={
//         email:"student@gmail.com",
//         username:"abcd",
//     }

//     let registerUser=await User.register(fackUser,"pass1234");
//     res.send(registerUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", bookingRouter);
app.use("/", userRouter);

// for all other requests
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    // a wrong id in the url (e.g. /listings/abc) is just "not found"
    if (err.name === "CastError") {
        statusCode = 404;
        message = "Page Not Found";
    }
    console.error(err);
    res.status(statusCode).render('error.ejs', { err: { message }, statusCode });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening at Port : ${PORT}`);
});

// Listing.deleteMany({title:"Sai Palace"},{}).then((res)=>{console.log(res);
// })
