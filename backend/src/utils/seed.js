const mongoose = require("mongoose");
const Item = require("../models/Item");

const NUM_ITEMS = 150;
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Toys",
  "Sports",
];

const adjectives = [
  "Quantum",
  "Superb",
  "Classic",
  "Digital",
  "Rustic",
  "Sleek",
  "Robust",
  "Cozy",
  "Ergonomic",
  "Next-Gen",
  "Vintage",
];
const nouns = {
  Electronics: [
    "Laptop",
    "Smartphone",
    "Headphones",
    "Monitor",
    "Tablet",
    "Camera",
    "Keyboard",
    "Webcam",
    "Microphone",
    "Router",
  ],
  Clothing: [
    "Jacket",
    "T-Shirt",
    "Jeans",
    "Sneakers",
    "Hat",
    "Sweater",
    "Socks",
    "Gloves",
    "Scarf",
    "Belt",
  ],
  Books: [
    "Novel",
    "Textbook",
    "Biography",
    "Cookbook",
    "Comic",
    "Manga",
    "Encyclopedia",
    "Guide",
    "Atlas",
    "Diary",
  ],
  Home: [
    "Lamp",
    "Sofa",
    "Desk",
    "Chair",
    "Vase",
    "Rug",
    "Curtains",
    "Blender",
    "Coffee Maker",
    "Bookshelf",
  ],
  Toys: [
    "Action Figure",
    "Board Game",
    "Doll",
    "Building Blocks",
    "Puzzle",
    "Remote Control Car",
    "Yo-Yo",
    "Kite",
    "Plushie",
    "Frisbee",
  ],
  Sports: [
    "Basketball",
    "Tennis Racket",
    "Soccer Ball",
    "Yoga Mat",
    "Dumbbells",
    "Helmet",
    "Gloves",
    "Gym Bag",
    "Jump Rope",
    "Water Bottle",
  ],
};
const brands = [
  "TechCorp",
  "StyleNu",
  "HomeEssentials",
  "PlayMakers",
  "FitLife",
  "ReadPro",
  "Sony",
  "Nike",
  "Ikea",
  "Hasbro",
  "Wilson",
  "Samsung",
];

const generatePrice = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(2));
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateSeedData = () => {
  const data = [];
  for (let i = 0; i < NUM_ITEMS; i++) {
    const category = pickRandom(CATEGORIES);
    const noun = pickRandom(nouns[category]);
    const adjective = pickRandom(adjectives);
    const title = `${adjective} ${noun} by ${pickRandom(brands)}`;

    const formattedTitle = title.replace(/\s+/g, "");
    const imageUrl = `https://picsum.photos/seed/${formattedTitle}/400/300`;

    data.push({
      title,
      description: `Enhance your life with this ${title.toLowerCase()}. Crafted for durability and style, it features top-tier materials and innovative design fitting perfectly in the ${category.toLowerCase()} category. You won't regret adding this to your collection. Highly recommended for daily use.`,
      category,
      price:
        category === "Electronics"
          ? generatePrice(50, 2000)
          : category === "Home"
            ? generatePrice(20, 500)
            : generatePrice(5, 100),
      brand: pickRandom(brands),
      imageUrl,
      isAvailable: Math.random() > 0.1, // 90% chance to be true
    });
  }
  return data;
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Checking current collection items count...");
    const count = await Item.countDocuments();
    if (count > 0) {
      console.log(
        `⚠️  Collection already contains ${count} items. Dropping existing records...`,
      );
      await Item.deleteMany({});
    }

    const items = generateSeedData();
    console.log(`🔄 Inserting ${items.length} records...`);
    await Item.insertMany(items);
    console.log("✅ Seed complete. Database populated structure created.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  const connectDB = require("../db/mongoose");
  connectDB().then(async () => {
    await seedDatabase();
    mongoose.connection.close();
    process.exit(0);
  });
}
