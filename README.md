# TripNest

Airbnb-style stay booking website (Node.js, Express, MongoDB, EJS).

## Features
- Owner and User accounts (sign up with email + password + confirm password)
- Owner: add / edit / delete own listings, dashboard (counts + earnings), confirm or reject bookings
- User: book stays, cancel bookings, wishlist (heart), add / edit / delete own reviews
- Search, category filters, price filter, sort, pagination (9 per page)
- Average star rating on cards, dark mode, mobile friendly pages
- Mapbox map, Cloudinary image upload

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your keys (database url, SECRET, Cloudinary, Mapbox)
3. Optional demo data: `node init/index.js` (20 stays around Kolhapur, Sangli, Miraj, Ichalkaranji)
4. `node app.js` and open http://localhost:8080

## Demo logins (after running the demo data script)
- Owner: demo.owner@tripnest.com / demo1234
- User: demo.user@tripnest.com / demo1234
