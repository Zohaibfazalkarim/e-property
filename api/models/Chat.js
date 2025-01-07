const mongoose=require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ type: Schema.Types.ObjectId }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  lastMessage: { type: String },
});

module.exports = mongoose.model('Chat', ChatSchema);
