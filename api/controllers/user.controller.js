const bcrypt = require("bcrypt");
const User = require("../models/User");
const SavedPost=require("../models/SavedPost");
const Chat = require("../models/Chat");
// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords from the result
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// Get a single user by ID
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; 
//   console.log(tokenUserId)
//   console.log(id)
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    let updatedPassword = null;

    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
      { new: true, select: "-password" } // Exclude the password from the result
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Assume this is set from middleware

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

// Save or remove a post
const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId; // Assuming middleware adds userId to req

  try {
    // Check if the post is already saved by the user
    const savedPost = await SavedPost.findOne({ user: tokenUserId, post: postId });

    if (savedPost) {
      // Remove saved post
      await SavedPost.deleteOne({ _id: savedPost._id });

      // Update user's savedPosts array
      await User.findByIdAndUpdate(
        tokenUserId,
        { $pull: { savedPosts: savedPost._id } }, // Remove reference from savedPosts array
        { new: true }
      );

      return res.status(200).json({ message: "Post removed from saved list", saved: false });
    } else {
      // Save new post
      const newSavedPost = new SavedPost({ user: tokenUserId, post: postId });
      const saved = await newSavedPost.save();

      // Update user's savedPosts array
      await User.findByIdAndUpdate(
        tokenUserId,
        { $addToSet: { savedPosts: saved._id } }, // Add reference to savedPosts array
        { new: true }
      );

      return res.status(200).json({ message: "Post saved successfully", saved: true });
    }
  } catch (err) {
    // Handle duplicate entry error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Post is already saved" });
    }
    console.error(err);
    return res.status(500).json({ message: "An error occurred while saving the post" });
  }
};


const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Fetch the user's posts and saved posts
    const user = await User.findById(tokenUserId)
      .populate({
        path: "posts",
        select: "-__v", // Exclude unnecessary fields (optional)
      })
      .populate({
        path: "savedPosts",
        populate: {
          path: "post", // Populate the associated post for each savedPost
          select: "-__v", // Exclude unnecessary fields (optional)
        },
      })
      .exec();
      // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Extract posts and saved posts
    const userPosts = user.posts || [];
    const savedPosts = user.savedPosts.map((savedPost) => savedPost.post) || [];

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.error("Error fetching profile posts:", err.message);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Count chats where the user is a participant but has not seen the chat
    const number = await Chat.countDocuments({
      users: tokenUserId, 
      seenBy: { $ne: tokenUserId }, // The user has not seen the chat
    });

    res.status(200).json(number);
  } catch (err) {
    console.error("Error fetching notification number:", err);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};






// Export the functions
module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  savePost,
  profilePosts,
  getNotificationNumber
};
