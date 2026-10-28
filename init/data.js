const sampleListings = [
  {
    title: "Rankala Lake View Stay",
    description:
      "Calm rooms close to Rankala Lake in Kolhapur. Evening walks by the lake, street food nearby and easy auto access to the city centre.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Rankala Lake, Kolhapur",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.2133, 16.6894] },
  },
  {
    title: "Mahalaxmi Heritage Inn",
    description:
      "Traditional-style guest rooms a short walk from the Mahalaxmi temple area. Simple, clean and ideal for pilgrims and families.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Mahalaxmi Temple Road, Kolhapur",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.2233, 16.7009] },
  },
  {
    title: "Rajarampuri Business Suites",
    description:
      "Comfortable suites in Rajarampuri with fast Wi-Fi, a work desk and a quick ride to the railway station and MIDC offices.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60",
    },
    price: 2600,
    location: "Rajarampuri, Kolhapur",
    country: "India",
    category: "cities",
    geometry: { type: "Point", coordinates: [74.231, 16.696] },
  },
  {
    title: "Shahupuri Pearl Residency",
    description:
      "Budget-friendly rooms in busy Shahupuri market area. Good for shopping trips and Kolhapuri chappal and gul markets.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Shahupuri, Kolhapur",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.238, 16.7] },
  },
  {
    title: "Tarabai Park Garden Villa",
    description:
      "A quiet villa-style stay with a small garden in Tarabai Park. Peaceful neighbourhood, parking and a family-sized kitchen.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?auto=format&fit=crop&w=800&q=60",
    },
    price: 3800,
    location: "Tarabai Park, Kolhapur",
    country: "India",
    category: "trending",
    geometry: { type: "Point", coordinates: [74.229, 16.708] },
  },
  {
    title: "Kasaba Bawada Farm Stay",
    description:
      "Green farm stay on the edge of Kolhapur. Fresh sugarcane fields, home-style Kolhapuri meals and open space for kids.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Kasaba Bawada, Kolhapur",
    country: "India",
    category: "farms",
    geometry: { type: "Point", coordinates: [74.263, 16.718] },
  },
  {
    title: "Kolhapur Bus Stand Express Rooms",
    description:
      "Simple, clean rooms right next to the central bus stand. Great for early departures and one-night stopovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Central Bus Stand, Kolhapur",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.2386, 16.704] },
  },
  {
    title: "Shiroli MIDC Comfort Lodge",
    description:
      "Practical lodge near Shiroli MIDC for business visitors. Air-conditioned rooms, parking and an in-house restaurant.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Shiroli MIDC, Kolhapur",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.299, 16.683] },
  },
  {
    title: "Panhala Fort View Retreat",
    description:
      "Wake up to views of the historic Panhala fort and cool hill air. Perfect for monsoon weekends and sunset points.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=800&q=60",
    },
    price: 3200,
    location: "Panhala, Kolhapur",
    country: "India",
    category: "castles",
    geometry: { type: "Point", coordinates: [74.11, 16.811] },
  },
  {
    title: "Panhala Hill Cottage",
    description:
      "A cosy hill cottage near Panhala with misty mornings, a fireplace corner and trails nearby.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60",
    },
    price: 2800,
    location: "Panhala, Kolhapur",
    country: "India",
    category: "mountains",
    geometry: { type: "Point", coordinates: [74.106, 16.809] },
  },
  {
    title: "Sangli Krishna Riverside Stay",
    description:
      "Riverside rooms in Sangli with a calm view of the Krishna river and quick access to the Ganpati temple.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Ganpati Peth, Sangli",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.5815, 16.8524] },
  },
  {
    title: "Sangli Turmeric City Hotel",
    description:
      "Central hotel in Sangli, known for its turmeric market. Walkable to the market yard, bus stand and railway station.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    },
    price: 1700,
    location: "Market Yard, Sangli",
    country: "India",
    category: "cities",
    geometry: { type: "Point", coordinates: [74.574, 16.859] },
  },
  {
    title: "Vishrambag Palace-Style Suites",
    description:
      "Spacious suites near Vishrambag with high ceilings and wooden furniture. A quiet base for exploring Sangli.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?auto=format&fit=crop&w=800&q=60",
    },
    price: 4200,
    location: "Vishrambag, Sangli",
    country: "India",
    category: "castles",
    geometry: { type: "Point", coordinates: [74.565, 16.847] },
  },
  {
    title: "Sangli Highway Pool Resort",
    description:
      "Resort-style stay on the highway side with a swimming pool, lawns and a banquet area for small functions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?auto=format&fit=crop&w=800&q=60",
    },
    price: 5200,
    location: "Sangli-Miraj Road, Sangli",
    country: "India",
    category: "pools",
    geometry: { type: "Point", coordinates: [74.6, 16.84] },
  },
  {
    title: "Miraj Music City Guest House",
    description:
      "Homely guest house in Miraj, the city of sitar makers. Close to the railway junction and the Dargah area.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=60",
    },
    price: 1300,
    location: "Miraj Station Road, Miraj",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.6458, 16.8219] },
  },
  {
    title: "Miraj Junction Executive Stay",
    description:
      "Clean business rooms near Miraj junction with early check-in for train travellers and a 24-hour front desk.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=60",
    },
    price: 1900,
    location: "Miraj Junction, Miraj",
    country: "India",
    category: "cities",
    geometry: { type: "Point", coordinates: [74.643, 16.825] },
  },
  {
    title: "Miraj Mission Road Garden Home",
    description:
      "Whole-home stay with a private garden, good for families visiting the hospitals and medical colleges in Miraj.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=800&q=60",
    },
    price: 3400,
    location: "Mission Road, Miraj",
    country: "India",
    category: "trending",
    geometry: { type: "Point", coordinates: [74.65, 16.819] },
  },
  {
    title: "Ichalkaranji Textile Town Inn",
    description:
      "Comfortable rooms for textile traders visiting Ichalkaranji, the town of looms. Near the main market and bus stand.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60",
    },
    price: 1400,
    location: "Main Road, Ichalkaranji",
    country: "India",
    category: "rooms",
    geometry: { type: "Point", coordinates: [74.46, 16.691] },
  },
  {
    title: "Panchganga Riverside Resort",
    description:
      "Open-air resort near the Panchganga river at Ichalkaranji, with a pool, kids play area and Maharashtrian thali dining.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?auto=format&fit=crop&w=800&q=60",
    },
    price: 4800,
    location: "Panchganga Ghat, Ichalkaranji",
    country: "India",
    category: "pools",
    geometry: { type: "Point", coordinates: [74.468, 16.685] },
  },
  {
    title: "Jaysingpur Sugarcane Farm Camp",
    description:
      "Tent and cottage camping among sugarcane fields near Jaysingpur. Bonfire evenings, tractor rides and village food.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Jaysingpur, Kolhapur",
    country: "India",
    category: "camping",
    geometry: { type: "Point", coordinates: [74.5597, 16.7794] },
  },
];

module.exports = { data: sampleListings };
