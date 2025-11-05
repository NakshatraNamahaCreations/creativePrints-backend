// scripts/seed.js
import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

// ---------- SOURCE ARRAYS ----------
const rawShape = [
  {
    title: "Standard",
    subtitle: "Mumbai, Pune, Bangalore & Hyderabad",
    badge: "New Options",
    price: "100 starting at Rs.200",
    image:
      "https://i.pinimg.com/1200x/41/1e/fa/411efa8a20a7a92798a949e3fb03cbd1.jpg",
    rating: 4.5,
    gallery: [
      { src: "https://i.pinimg.com/1200x/41/1e/fa/411efa8a20a7a92798a949e3fb03cbd1.jpg", alt: "Front View" },
      { src: "https://i.pinimg.com/1200x/41/1e/fa/411efa8a20a7a92798a949e3fb03cbd1.jpg", alt: "Side View" },
    ],
    highlights: [
      "4000+ design options available",
      "Glossy or matte paper included",
    ],
    quantities: [
      { qty: 100, price: 200, unit: 2 },
      { qty: 200, price: 340, unit: 1.7 },
    ],
    overviewSections: [
      {
        title: "Your business is one of a kind",
        bodyHtml:
          "<p>With a fresh box of professional visiting cards comes confidence...</p>",
        media: {
          type: "image",
          src: "https://i.pinimg.com/1200x/41/1e/fa/411efa8a20a7a92798a949e3fb03cbd1.jpg",
          alt: "Overview",
        },
        mediaPosition: "right",
      },
    ],
  },
// Add these after your "Standard" object in rawShape:

{
  title: "Classic",
  subtitle: "Timeless look with crisp print",
  badge: "Best Seller",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/736x/c5/96/27/c59627e03be50c6e935a30d8c9e1b148.jpg",
  rating: 4,
  gallery: [
    { src: "https://i.pinimg.com/736x/c5/96/27/c59627e03be50c6e935a30d8c9e1b148.jpg", alt: "Classic Visiting Card Front" },
    { src: "https://i.pinimg.com/736x/c5/96/27/c59627e03be50c6e935a30d8c9e1b148.jpg", alt: "Classic Texture Close-up" },
  ],
  highlights: [
    "Clean, professional layout",
    "High-contrast text for legibility",
  ],
  quantities: [
    { qty: 100, price: 200, unit: 2 },
    { qty: 200, price: 360, unit: 1.8 },
    { qty: 500, price: 800, unit: 1.6 },
  ],
  overviewSections: [
    {
      title: "A dependable first impression",
      bodyHtml: "<p>Classic cards keep the focus on your brand details: name, title, and contact. Perfect for formal networking and corporate teams.</p>",
      media: {
        type: "image",
        src: "https://i.pinimg.com/736x/c5/96/27/c59627e03be50c6e935a30d8c9e1b148.jpg",
        alt: "Classic business cards on desk",
      },
      mediaPosition: "right",
    },
  ],
},

{
  title: "Rounded Corner",
  subtitle: "Soft edges, modern aesthetic",
  badge: "Popular Choice",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/736x/f2/02/04/f20204e10340ed83998b72843e9c6978.jpg",
  rating: 4.6,
  gallery: [
    { src: "https://i.pinimg.com/736x/f2/02/04/f20204e10340ed83998b72843e9c6978.jpg", alt: "Rounded Corner Card Front" },
    { src: "https://i.pinimg.com/736x/f2/02/04/f20204e10340ed83998b72843e9c6978.jpg", alt: "Rounded corner detail" },
  ],
  highlights: [
    "Durable, snag-free corners",
    "Friendly, premium look",
  ],
  quantities: [
    { qty: 100, price: 240, unit: 2.4 },
    { qty: 200, price: 420, unit: 2.1 },
    { qty: 500, price: 950, unit: 1.9 },
  ],
  overviewSections: [
    {
      title: "Smoother feel, stronger brand",
      bodyHtml: "<p>Rounded corners stand out subtly while resisting wear and tear. Great for creative pros and hospitality brands.</p>",
      media: {
        type: "image",
        src: "https://i.pinimg.com/736x/f2/02/04/f20204e10340ed83998b72843e9c6978.jpg",
        alt: "Stack of rounded corner cards",
      },
      mediaPosition: "left",
    },
  ],
},

{
  title: "Square",
  subtitle: "Eye-catching square format",
  badge: "New options",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/736x/02/10/38/02103804d0132d6edc66b928e678d58e.jpg",
  rating: 4.2,
  gallery: [
    { src: "https://i.pinimg.com/736x/02/10/38/02103804d0132d6edc66b928e678d58e.jpg", alt: "Square Card Front" },
    { src: "https://i.pinimg.com/736x/02/10/38/02103804d0132d6edc66b928e678d58e.jpg", alt: "Square card layout grid" },
  ],
  highlights: [
    "Stand-out shape for small logos",
    "Compact, social-friendly size",
  ],
  quantities: [
    { qty: 100, price: 230, unit: 2.3 },
    { qty: 200, price: 400, unit: 2.0 },
    { qty: 500, price: 900, unit: 1.8 },
  ],
  overviewSections: [
    {
      title: "Different by design",
      bodyHtml: "<p>Square cards create instant visual interest. Perfect for boutiques, studios, and modern brands that love minimal grids.</p>",
      media: {
        type: "image",
        src: "https://i.pinimg.com/736x/02/10/38/02103804d0132d6edc66b928e678d58e.jpg",
        alt: "Square business cards on table",
      },
      mediaPosition: "right",
    },
  ],
},

{
  title: "Leaf Visiting Cards",
  subtitle: "Organic curves with premium print",
  badge: "Eco-inspired",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/1200x/3c/1c/c6/3c1cc641c408b77d66a29c9fa1198753.jpg",
  rating: 4.3,
  gallery: [
    { src: "https://i.pinimg.com/1200x/3c/1c/c6/3c1cc641c408b77d66a29c9fa1198753.jpg", alt: "Leaf Card Front" },
    { src: "https://images.unsplash.com/photo-1487412720507-3e04adf59be2?q=80&w=1080&auto=format&fit=crop", alt: "Leaf motif close-up" },
  ],
  highlights: [
    "Smooth leaf-shaped die cut",
    "Premium feel for nature brands",
  ],
  quantities: [
    { qty: 100, price: 260, unit: 2.6 },
    { qty: 200, price: 460, unit: 2.3 },
    { qty: 500, price: 1100, unit: 2.2 },
  ],
  overviewSections: [
    {
      title: "Fresh, organic presentation",
      bodyHtml: "<p>Leaf cards pair beautifully with wellness, organic food, and eco-conscious brands to reflect natural aesthetics.</p>",
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?q=80&w=1080&auto=format&fit=crop",
        alt: "Leaf shape design inspiration",
      },
      mediaPosition: "left",
    },
  ],
},

{
  title: "Oval Visiting Cards",
  subtitle: "Elegant curves for softer branding",
  badge: "Buy 25 @Rs.250",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/736x/b5/ef/28/b5ef28b53bbd2011186644a02d7dc54b.jpg",
  rating: 3.5,
  gallery: [
    { src: "https://i.pinimg.com/736x/b5/ef/28/b5ef28b53bbd2011186644a02d7dc54b.jpg", alt: "Oval Card Front" },
    { src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1080&auto=format&fit=crop", alt: "Oval edge detail" },
  ],
  highlights: [
    "Curved silhouette that stands out",
    "Ideal for salons, boutiques, crafts",
  ],
  quantities: [
    { qty: 100, price: 240, unit: 2.4 },
    { qty: 200, price: 420, unit: 2.1 },
    { qty: 500, price: 980, unit: 2.0 },
  ],
  overviewSections: [
    {
      title: "Graceful and memorable",
      bodyHtml: "<p>Oval cards feel approachable and distinct. A perfect match for lifestyle and design-led brands.</p>",
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=1080&auto=format&fit=crop",
        alt: "Oval cards stack",
      },
      mediaPosition: "right",
    },
  ],
},

{
  title: "Circle Visiting Cards",
  subtitle: "Playful circular format",
  badge: "Limited Stock",
  price: "100 starting at Rs.200",
  image: "https://i.pinimg.com/1200x/63/ec/38/63ec3820b13892a7aa9ed31fe1bf1dc2.jpg",
  rating: 3.8,
  gallery: [
    { src: "https://i.pinimg.com/1200x/63/ec/38/63ec3820b13892a7aa9ed31fe1bf1dc2.jpg", alt: "Circle Card Front" },
    { src: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1080&auto=format&fit=crop", alt: "Circular layout detail" },
  ],
  highlights: [
    "Bold, fun shape for creatives",
    "Perfect for stickers & QR codes",
  ],
  quantities: [
    { qty: 100, price: 250, unit: 2.5 },
    { qty: 200, price: 440, unit: 2.2 },
    { qty: 500, price: 1000, unit: 2.0 },
  ],
  overviewSections: [
    {
      title: "Make your brand pop",
      bodyHtml: "<p>Circle cards are made for creatives—illustrators, cafés, event brands—who want playful, memorable handouts.</p>",
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1520713028662-6f2591956b94?q=80&w=1080&auto=format&fit=crop",
        alt: "Round business cards scene",
      },
      mediaPosition: "left",
    },
  ],
},
]

const rawPaper = [
  { title: "Glossy", subtitle: "Mumbai, Pune, Bangalore & Hyderabad", badge: "New Options", price: "100 staring at Rs.200", image: "https://i.pinimg.com/1200x/f3/45/8f/f3458fa81422ef7ed36afda036c79ab2.jpg", rating: 4.5 },
  { title: "Matte", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/4e/83/cc/4e83cc93db6d801fcdf43a80260f5ff6.jpg", rating: 4 },
  { title: "Non-Tearable", price: "100 staring at Rs.200", image: "https://i.pinimg.com/1200x/10/8c/a5/108ca553f2af688b174c0be0b7e8ebe9.jpg", rating: 4.6 },
  { title: "Spot UV", badge: "New options", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/7c/55/45/7c5545b873248e15028123f6ad8c9eb3.jpg", rating: 4.2 },
  { title: "Raised Foil Visiting Cards", subtitle: "High-carbon steel, razor-sharp edge", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/9c/d9/f6/9cd9f609a2fb04110292d861bd2cf326.jpg", rating: 4.3 },
  { title: "Premium Plus Glossy", subtitle: "Extra thick for joint comfort, eco-friendly", badge: "Buy 25 @Rs.250", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/51/28/78/512878bffcbe9de5f067d92c63dc64bd.jpg", rating: 3.5 },
  { title: "Magnetic Visiting Cards", subtitle: "RGB backlit, tactile switches for gaming", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/90/44/4c/90444c661f02b9c8032011dc3c8e4c16.jpg", rating: 3.8 },
  { title: "Transparent Visiting Cards", subtitle: "RGB backlit, tactile switches for gaming", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/29/22/cc/2922cced7a1ec00540ad82182d8c4958.jpg", rating: 3.8 },
  { title: "Bulk Visiting Cards", subtitle: "RGB backlit, tactile switches for gaming", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/38/12/d6/3812d6c5959c7f2cc0d8189ebaab0c76.jpg", rating: 3.8 },
  { title: "Velvet Touch", subtitle: "RGB backlit, tactile switches for gaming", price: "100 staring at Rs.200", image: "https://i.pinimg.com/736x/49/0c/6d/490c6d21db8885d6e57df94426600cde.jpg", rating: 3.8 },
];

const rawSpecialty = [
  { title: "QR code Visiting Cards", subtitle: "Mumbai, Pune, Bangalore & Hyderabad", badge: "New Options", price: "100 staring at Rs.200", image: "https://i.pinimg.com/1200x/1f/da/ef/1fdaefb9944edf9242ecc40e81cef43e.jpg", rating: 4.5 },
  { title: "NFC Visiting Cards", price: "1 staring at Rs.750", image: "https://i.pinimg.com/1200x/82/a7/cf/82a7cf7daf6efdd15da0bac9718193e9.jpg", rating: 4 },
];

// ---------- HELPERS ----------
const toSlug = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const mapList = (list, group) =>
  list.filter(Boolean).map((item) => ({
    title: item.title,
    subtitle: item.subtitle || "",
    badge: item.badge || "",
    priceText: item.price || "",
    image: item.image,
    rating: item.rating ?? null,
    group, // "shape" | "paper" | "specialty"
    slug: toSlug(item.title),

    // detail fields
    gallery: item.gallery ?? [],
    highlights: item.highlights ?? [],
    badges: item.badges ?? [],
    basePriceNote: item.basePriceNote ?? "",
    shippingBanner: item.shippingBanner ?? null,
    deliveryOptions: item.deliveryOptions ?? [],
    cornerOptions: item.cornerOptions ?? [],
    quantities: item.quantities ?? [],
    overviewSections: item.overviewSections ?? [],
    reviews: item.reviews ?? [],
    ctas: item.ctas ?? null,
  }));

const docs = [
  ...mapList(rawShape, "shape"),
  ...mapList(rawPaper, "paper"),
  ...mapList(rawSpecialty, "specialty"),
];

// ---------- RUN ----------
(async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!uri) throw new Error("Missing MONGO_URI/MONGO_URL");
    await mongoose.connect(uri);
    console.log("✅ Connected. DB:", mongoose.connection.name);

    // optional: clear indexes in dev if you hit E11000
    // await Product.collection.dropIndexes().catch(() => {});

    await Product.deleteMany({});
    console.log("🧹 Cleared collection");

    const inserted = await Product.insertMany(docs, { ordered: false });
    console.log(`🌱 Seeded ${inserted.length} products`);
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
