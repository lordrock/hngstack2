const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  gender: {
    type: String,
    required: true
  },
  gender_probability: {
    type: Number,
    required: true
  },
  sample_size: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  age_group: {
    type: String,
    required: true,
    enum: ["child", "teenager", "adult", "senior"]
  },
  country_id: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  country_probability: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
{ timestamps: true }