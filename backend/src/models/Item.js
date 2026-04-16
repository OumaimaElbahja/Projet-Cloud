const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Electronics", "Clothing", "Books", "Home", "Toys", "Sports"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/300?text=No+Image",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Primary compound text index for efficient full-text searches.
// Weights prioritize matches in title over description.
ItemSchema.index(
  {
    title: "text",
    description: "text",
    category: "text",
  },
  {
    weights: {
      title: 10,
      category: 5,
      description: 1,
    },
    name: "ItemTextIndex",
  },
);

// Indexes to speed up queries that rely purely on sorting or boolean filtering
ItemSchema.index({ category: 1 });
ItemSchema.index({ price: 1 });
ItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Item", ItemSchema);
