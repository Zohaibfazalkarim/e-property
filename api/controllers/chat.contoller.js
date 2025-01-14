const Chat = require("../models/Chat");
const User = require("../models/User");

// Get all chats for the logged-in user
const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({ users: tokenUserId })
      .populate("users", "id username avatar")
      .exec();

    const formattedChats = chats.map((chat) => {
      const receiver = chat.users.find((user) => user._id.toString() !== tokenUserId);
      return { ...chat.toObject(), receiver };
    });

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get a single chat with messages
const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, users: tokenUserId })
      .populate("messages")
      .populate("users", "id username avatar")
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Mark chat as read by adding the current user's ID to the seenBy field if not already present
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save(); // Save the chat after updating seenBy
    }

    res.status(200).json(chat); // Send back the updated chat data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Create a new chat or return an existing one
const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    let chat = await Chat.findOne({
      users: { $all: [tokenUserId, receiverId] },
    }).populate("users", "id username avatar");

    if (!chat) {
      chat = new Chat({
        users: [tokenUserId, receiverId],
      });

      await chat.save();
      chat = await chat.populate("users", "id username avatar");
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add or fetch chat!" });
  }
};

// Mark a chat as read
const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, users: tokenUserId },
      { $addToSet: { seenBy: tokenUserId } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark chat as read!" });
  }
};

module.exports = {
  getChats,
  getChat,
  addChat,
  readChat,
};
