const User = require("../models/user");
const Listing = require("../models/listing");


module.exports.renderSignupForm = (req, res) => {
    // /signup?role=owner pre-selects the Owner option
    let role = req.query.role === "owner" ? "owner" : "user";
    res.render("users/signup.ejs", { role });
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password, role } = req.body;
        const newUser = new User({ username, email, role });
        const registeredUser = await User.register(newUser, password);
        req.logIn(registeredUser, (e) => {
            if (e) {
                return next(e);
            }
            req.flash('success', `Welcome to TripNest, ${registeredUser.username}!`);
            res.redirect(registeredUser.role === "owner" ? "/listings/mine" : "/listings");
        })

    } catch (e) {
        let msg = e.message;
        if (e.code === 11000) {
            msg = "This username or email is already registered.";
        }
        req.flash("error", msg);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to TripNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
}


// ---- WISHLIST (user accounts only) ----
module.exports.renderWishlist = async (req, res) => {
    const allListings = await Listing.find({ _id: { $in: req.user.wishlist } }).populate("reviews", "rating");
    res.render("listing/index.ejs", {
        allListings,
        page: 1,
        totalPages: 1,
        totalCount: allListings.length,
        query: { q: "", category: "", minPrice: "", maxPrice: "", sort: "" },
        basePath: "/wishlist",
        heading: "My Wishlist",
        showFilters: false,
        wishIds: allListings.map((l) => String(l._id))
    });
}

// add / remove a listing from the wishlist (heart icon)
module.exports.toggleWishlist = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const wantsJson = (req.get("Accept") || "").includes("application/json");

    if (!listing) {
        if (wantsJson) return res.status(404).json({ error: "Listing not found" });
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const alreadySaved = (req.user.wishlist || []).some((w) => w.equals(id));
    await User.updateOne(
        { _id: req.user._id },
        alreadySaved ? { $pull: { wishlist: id } } : { $addToSet: { wishlist: id } }
    );

    if (wantsJson) return res.json({ saved: !alreadySaved });
    req.flash("success", alreadySaved ? "Removed from wishlist." : "Saved to wishlist!");
    res.redirect(req.get("Referer") || "/listings");
}
