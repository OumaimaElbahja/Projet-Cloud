const Product = require("./models/Product");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://oumaimaelbahja2003_db_user:test123@cluster1.xmqwjks.mongodb.net/searchDB")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API working");
});

app.get("/add", async (req, res) => {
  await Product.create({
    name: "Laptop",
    description: "Powerful computer"
  });

  await Product.create({
    name: "Phone",
    description: "Smartphone Android"
  });

  await Product.create({
    name: "Headphones",
    description: "Wireless audio device"
  });

  res.send("Data added");
});

app.get("/search", async (req, res) => {
  const q = req.query.q;

  const results = await Product.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ]
  });

  res.json(results);
});

// ✅ TOUJOURS EN DERNIER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});