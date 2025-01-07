const mongoose = require("mongoose");
const { Schema } = mongoose;

const SavedPostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Define a composite unique index for user and post
SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", SavedPostSchema);
