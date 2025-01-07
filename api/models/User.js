const mongoose = require("mongoose");
const { Schema } = mongoose;
const Post = require("./Post");  // Import the Post model
const SavedPost = require("./SavedPost");  // Import SavedPost model
const Chat = require("./Chat");  // Import Chat model

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],  // References to Post model
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedPost" }],  // References to SavedPost model
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],  // References to Chat model
});

module.exports = mongoose.model("User", UserSchema);
