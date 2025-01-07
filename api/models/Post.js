const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User");  // Import the User model
const PostDetailSchema = require("./PostDetails");

const postSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  type: { type: String, enum: ["buy", "rent"], required: true },
  property: { type: String, enum: ["house", "apartment", "condo", "land"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postDetails: { type: mongoose.Schema.Types.ObjectId, ref: "PostDetail" }
});

module.exports = mongoose.model("Post", postSchema);



