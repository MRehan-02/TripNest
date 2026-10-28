const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const PER_PAGE = 9;
const CATEGORIES = ["trending", "rooms", "cities", "mountains", "castles", "arctic", "camping", "farms", "pools", "domes", "boats"];

// one function used by /listings and /listings/mine
// handles search (q), category filter, price filter, sort and pagination
async function renderListings(req, res, extraFilter, basePath, heading) {
    let { q, category, minPrice, maxPrice, sort, page } = req.query;
    const filter = { ...extraFilter };

    if (q && q.trim() !== "") {
        // escape special characters so searches like "(" don't crash
        const safeQ = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { title: { $regex: safeQ, $options: "i" } },
            { location: { $regex: safeQ, $options: "i" } },
            { country: { $regex: safeQ, $options: "i" } }
        ];
    }

    // "trending" means all listings
    if (category && CATEGORIES.includes(category) && category !== "trending") {
        filter.category = category;
    }

    const priceFilter = {};
    if (minPrice !== undefined && minPrice !== "" && !isNaN(minPrice)) priceFilter.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(maxPrice)) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length) filter.price = priceFilter;

    let sortObj = { _id: -1 }; // newest first
    if (sort === "price_asc") sortObj = { price: 1, _id: 1 };
    if (sort === "price_desc") sortObj = { price: -1, _id: 1 };

    const totalCount = await Listing.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
    page = Math.min(Math.max(parseInt(page) || 1, 1), totalPages);

    const allListings = await Listing.find(filter)
        .sort(sortObj)
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .populate("reviews", "rating");

    const wishIds = req.user ? (req.user.wishlist || []).map(String) : [];

    res.render("listing/index.ejs", {
        allListings,
        page,
        totalPages,
        totalCount,
        query: { q: q || "", category: category || "", minPrice: minPrice || "", maxPrice: maxPrice || "", sort: sort || "" },
        basePath,
        heading,
        showFilters: true,
        wishIds
    });
}

module.exports.index = async (req, res, next) => {
    await renderListings(req, res, {}, "/listings", "");
};

module.exports.myListings = async (req, res, next) => {
    await renderListings(req, res, { owner: req.user._id }, "/listings/mine", "My Listings");
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Please upload an image for the listing.");
        return res.redirect("/listings/new");
    }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    if (response.body.features.length) {
        newListing.geometry = response.body.features[0].geometry;
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings/mine");
}

module.exports.editForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = (listing.image && listing.image.url) ? listing.image.url : "";
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    }
    res.render("listing/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res, next) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
    }
    // location changed -> update the map point too
    if (req.body.listing.location && req.body.listing.location !== listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        if (response.body.features.length) {
            listing.geometry = response.body.features[0].geometry;
        }
    }
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    if (!delListing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings/mine");
}
