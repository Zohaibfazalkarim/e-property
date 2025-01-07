
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
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Create a new chat
const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;
  console.log(tokenUserId)
  console.log(receiverId)

  try {
    // Check if a chat between these users already exists
    const existingChat = await Chat.findOne({
      users: { $all: [tokenUserId, receiverId] },
    });

    if (existingChat) {
      return res.status(400).json({ message: "Chat already exists!" });
    }

    const newChat = new Chat({
      users: [tokenUserId, receiverId],
    });

    await newChat.save();
    res.status(200).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add chat!" });
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
