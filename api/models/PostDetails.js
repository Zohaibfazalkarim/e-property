const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = require("./Post");

const PostDetailSchema = new Schema({
  desc: { type: String, required: true },
  utilities: { type: String },
  pet: { type: String },
  income: { type: String },
  size: { type: Number },
  school: { type: Number },
  bus: { type: Number },
  restaurant: { type: Number },
  post: { type: mongoose.Schema.Types.ObjectId, 
  ref: "Post" }, // References to Post model
});

module.exports = mongoose.model('PostDetail', PostDetailSchema);

