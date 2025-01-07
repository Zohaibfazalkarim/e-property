const Chat = require("../models/Chat");
const Message = require("../models/Message");

const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    // Find the chat and ensure the user is part of it
    const chat = await Chat.findOne({
      _id: chatId,
      users: tokenUserId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Create a new message
    const message = new Message({
      text,
      chat: chatId,
      userId: tokenUserId,
    });

    await message.save();

    // Update the chat with the last message and seenBy
    chat.messages.push(message._id);
    chat.lastMessage = text;
    chat.seenBy = [tokenUserId];
    await chat.save();

    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

module.exports = { addMessage };
