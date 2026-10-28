require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.ATLASEDB_URL)
  .then(async () => {
    console.log("Connected to database:", mongoose.connection.name);
    const cols = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", cols.map((c) => c.name));
    const listings = await mongoose.connection.db.collection("listings").countDocuments();
    console.log("Listings count:", listings);
    process.exit(0);
  })
  .catch((e) => {
    console.log("ERROR:", e.message);
    process.exit(1);
  });