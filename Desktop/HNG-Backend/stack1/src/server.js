const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Profile = require("./models/profile");
const { v7: uuidv7 } = require("uuid");
const {
  normalizeName,
  getAgeGroup,
  getTopCountry,
  sendError
} = require("./utils/helpers");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
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

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Profile Intelligence Service is running");
});

// POST /api/profiles
app.post("/api/profiles", async (req, res) => {
  try {
    const { name } = req.body;

    if (name === undefined || name === null) {
      return sendError(res, 400, "Missing or empty name");
    }

    if (typeof name !== "string") {
      return sendError(res, 422, "Invalid type");
    }

    const normalizedName = normalizeName(name);

    if (normalizedName === "") {
      return sendError(res, 400, "Missing or empty name");
    }

    const existingProfile = await Profile.findOne({ name: normalizedName });

    if (existingProfile) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: {
          id: existingProfile.id,
          name: existingProfile.name,
          gender: existingProfile.gender,
          gender_probability: existingProfile.gender_probability,
          sample_size: existingProfile.sample_size,
          age: existingProfile.age,
          age_group: existingProfile.age_group,
          country_id: existingProfile.country_id,
          country_probability: existingProfile.country_probability,
          created_at: existingProfile.created_at
        }
      });
    }

    const [genderizeResponse, agifyResponse, nationalizeResponse] = await Promise.all([
      fetch(`https://api.genderize.io?name=${encodeURIComponent(normalizedName)}`),
      fetch(`https://api.agify.io?name=${encodeURIComponent(normalizedName)}`),
      fetch(`https://api.nationalize.io?name=${encodeURIComponent(normalizedName)}`)
    ]);

    if (!genderizeResponse.ok) {
      return sendError(res, 502, "Genderize returned an invalid response");
    }

    if (!agifyResponse.ok) {
      return sendError(res, 502, "Agify returned an invalid response");
    }

    if (!nationalizeResponse.ok) {
      return sendError(res, 502, "Nationalize returned an invalid response");
    }

    const genderizeData = await genderizeResponse.json();
    const agifyData = await agifyResponse.json();
    const nationalizeData = await nationalizeResponse.json();

    if (genderizeData.gender === null || genderizeData.count === 0) {
      return sendError(res, 502, "Genderize returned an invalid response");
    }

    if (agifyData.age === null) {
      return sendError(res, 502, "Agify returned an invalid response");
    }

    if (
      !Array.isArray(nationalizeData.country) ||
      nationalizeData.country.length === 0
    ) {
      return sendError(res, 502, "Nationalize returned an invalid response");
    }

    const gender = genderizeData.gender;
    const genderProbability = genderizeData.probability;
    const sampleSize = genderizeData.count;

    const age = agifyData.age;
    const ageGroup = getAgeGroup(age);

    if (!ageGroup) {
      return sendError(res, 500, "Failed to classify age group");
    }

    const topCountry = getTopCountry(nationalizeData.country);

    if (!topCountry) {
      return sendError(res, 502, "Nationalize returned an invalid response");
    }

    const countryId = topCountry.country_id;
    const countryProbability = topCountry.probability;

    const newProfile = new Profile({
      id: uuidv7(),
      name: normalizedName,
      gender,
      gender_probability: genderProbability,
      sample_size: sampleSize,
      age,
      age_group: ageGroup,
      country_id: countryId,
      country_probability: countryProbability,
      created_at: new Date().toISOString()
    });

    await newProfile.save();

    return res.status(201).json({
      status: "success",
      data: {
        id: newProfile.id,
        name: newProfile.name,
        gender: newProfile.gender,
        gender_probability: newProfile.gender_probability,
        sample_size: newProfile.sample_size,
        age: newProfile.age,
        age_group: newProfile.age_group,
        country_id: newProfile.country_id,
        country_probability: newProfile.country_probability,
        created_at: newProfile.created_at
      }
    });
  } catch (error) {
    console.error("POST /api/profiles error:", error.message);
    return sendError(res, 500, "Internal server error");
  }
});

// GET /api/profiles/:id
// GET /api/profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const { gender, country_id, age_group } = req.query;

    let filter = {};

    // Case-insensitive filtering
    if (gender) {
      filter.gender = new RegExp(`^${gender}$`, "i");
    }

    if (country_id) {
      filter.country_id = new RegExp(`^${country_id}$`, "i");
    }

    if (age_group) {
      filter.age_group = new RegExp(`^${age_group}$`, "i");
    }

    const profiles = await Profile.find(filter);

    return res.status(200).json({
      status: "success",
      count: profiles.length,
      data: profiles.map(profile => ({
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id
      }))
    });
  } catch (error) {
    console.error("GET /api/profiles error:", error.message);
    return sendError(res, 500, "Internal server error");
  }
});

// DELETE /api/profiles/:id
app.delete("/api/profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ id });

    if (!profile) {
      return sendError(res, 404, "Profile not found");
    }

    await Profile.deleteOne({ id });

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE /api/profiles/:id error:", error.message);
    return sendError(res, 500, "Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});