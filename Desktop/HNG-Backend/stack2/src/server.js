const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Profile = require("./models/Profile");

const {
  buildProfileFilters,
  buildSortOptions,
  getPagination
} = require("./utils/queryHelpers");

const validateProfileQuery = require("./utils/validateQuery");
const parseNaturalLanguageQuery = require("./utils/nlQueryParser");
const formatProfile = require("./utils/formatProfile");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Stage 2 Intelligence Query Engine is running");
});

// GET /api/profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const isValid = validateProfileQuery(req.query);

    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }

    const filters = buildProfileFilters(req.query);
    const sortOptions = buildSortOptions(req.query.sort_by, req.query.order);

    if (!sortOptions) {
      return res.status(400).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }

    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

    const total = await Profile.countDocuments(filters);

    const profiles = await Profile.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data: profiles.map(formatProfile)
    });
  } catch (error) {
    console.error("GET /api/profiles error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// GET /api/profiles/search
app.get("/api/profiles/search", async (req, res) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty parameter"
      });
    }

    const filters = parseNaturalLanguageQuery(q);

    if (!filters) {
      return res.status(400).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    const pagination = getPagination(page, limit);

    const total = await Profile.countDocuments(filters);

    const profiles = await Profile.find(filters)
      .skip(pagination.skip)
      .limit(pagination.limit);

    return res.status(200).json({
      status: "success",
      page: pagination.page,
      limit: pagination.limit,
      total,
      data: profiles.map(formatProfile)
    });
  } catch (error) {
    console.error("GET /api/profiles/search error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();