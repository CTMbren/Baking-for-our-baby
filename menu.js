// ============================================================
//  EDIT THIS FILE to change your menu and settings.
//  You never need to touch index.html or the order script.
// ============================================================

const SETTINGS = {
  title: "Baking for Our Baby",
  tagline: "Homemade treats, baked with love, to help us grow our family.",
  intro:
    "We're raising money for fertility treatment, and we're doing it the way we know best: baking. " +
    "Pick what you'd like below, send your order, and we'll get in touch to confirm pickup and payment. " +
    "Thank you for being part of our story!",

  // Paste your Google Apps Script web app URL here (see README.md, step 3).
  orderEndpoint: "https://script.google.com/macros/s/AKfycbzZhIXCiRhO4aVk9pseCbFMxN2aXkDbGyRzJn3N08WHr3MAsxqfI4WSjA6PB4ip7sOrVQ/exec",

  currency: "$",

  // Shown above the form. Leave "" to hide.
  orderDeadline: "Orders close: (add a date)",

  // Choices in the pickup dropdown. Edit freely.
  pickupOptions: [
    "Pickup - I'll arrange a time with you",
    "Delivery - I'll arrange details with you",
  ],

  paymentNote:
    "No payment is taken on this page. We'll confirm your order and let you know how to pay (e.g. e-transfer or cash at pickup).",
};

// image: put the photo in the images/ folder and use its file name here.
// If the photo isn't there yet, a placeholder is shown automatically.
// price: PLACEHOLDER PRICES - change these to your real prices.
const MENU = [
  {
    id: "cookies",
    name: "Chocolate Chip Cookies",
    size: "Full batch (12-16 cookies)",
    description: "Soft in the middle, crisp at the edges, loaded with chocolate chips.",
    price: 20,
    image: "images/chocolate-chip-cookies.jpg",
    emoji: "🍪",
  },
  {
    id: "banana-bread",
    name: "Banana Bread",
    size: "1 full loaf",
    description: "Moist, golden and made with very ripe bananas.",
    price: 15,
    image: "images/banana-bread.jpg",
    emoji: "🍞",
  },
  {
    id: "brownies",
    name: "Brownies",
    size: "8x8 pan",
    description: "Rich, fudgy chocolate brownies, cut into squares.",
    price: 25,
    image: "images/brownies.jpg",
    emoji: "🍫",
  },
];
