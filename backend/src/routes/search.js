const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const { z } = require("zod");

// Schema for Search Query Validation
const searchRequestSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z
    .enum(["relevance", "priceAsc", "priceDesc", "newest"])
    .optional()
    .default("relevance"),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
});

// Helper for sending validation errors
const sendValidationError = (res, error) => {
  return res
    .status(400)
    .json({ error: "Validation Error", details: error.errors });
};

/**
 * @route GET /api/search
 * @desc Get all items by keyword, paginated, and sortable
 */
router.get("/search", async (req, res) => {
  try {
    const result = searchRequestSchema.safeParse(req.query);
    if (!result.success) return sendValidationError(res, result.error);

    const { q, category, sort, page, limit } = result.data;
    const skip = (page - 1) * limit;

    const query = {};
    const projection = {};
    const options = {
      skip,
      limit,
    };

    // If searching with keywords, use $text and project textScore for sorting if 'relevance' is selected
    if (q) {
      query.$text = { $search: q };
      projection.score = { $meta: "textScore" };
    }

    // Exact match filter for category
    if (category && category !== "All") {
      query.category = category;
    }

    // Ensure "relevance" sorting is only applied if a text query exists.
    // Fallback to 'newest' when $text isn't provided but 'relevance' was asked.
    let sortOption = {};
    switch (sort) {
      case "priceAsc":
        sortOption = { price: 1 };
        break;
      case "priceDesc":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "relevance":
      default:
        if (q) {
          sortOption = { score: { $meta: "textScore" } };
        } else {
          sortOption = { createdAt: -1 };
        }
        break;
    }

    options.sort = sortOption;

    const [items, totalCount] = await Promise.all([
      Item.find(query, projection, options),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      items,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    console.error("Search Route Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route GET /api/suggestions
 * @desc Auto-complete suggestions endpoint
 */
router.get("/suggestions", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Find documents that partially match the prefix
    // Note: MongoDB $text index doesn't natively support partial matching or true type-ahead without Atlas Search Edge.
    // For standard MongoDB free-tier without Atlas Search configuration,
    // regex queries on indexed string fields are the fallback for autocomplete,
    // although less performant at massive scales, for 150+ items it's sufficient.
    const suggestions = await Item.find({
      title: { $regex: new RegExp(q, "i") },
    })
      .select("title")
      .limit(5)
      .lean();

    // Extract and deduplicate
    const uniqueTitles = [...new Set(suggestions.map((item) => item.title))];

    res.status(200).json({ suggestions: uniqueTitles });
  } catch (err) {
    console.error("Suggestions Route Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route POST /api/seed
 * @desc Trigger manual seed population
 */
router.post("/seed", async (req, res) => {
  try {
    const seedData = require("../utils/seed");
    await seedData();
    res
      .status(201)
      .json({ message: "Seed run complete. Check terminal for details." });
  } catch (err) {
    console.error("Seed Route Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
