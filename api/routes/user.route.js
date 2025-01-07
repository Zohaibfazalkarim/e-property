const express=require("express");
const{deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber} =require("../controllers/user.controller.js")
const {verifyToken} =require("../middleware/verifyToken.js");
const SavedPost = require("../models/SavedPost.js");
const router = express.Router();


router.get("/", getUsers);
router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/savedStatus/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const tokenUserId = req.userId; 

  try {
    const savedPost = await SavedPost.findOne({ user: tokenUserId, post: postId });

    if (savedPost) {
      return res.status(200).json({ saved: true });
    } else {
      return res.status(200).json({ saved: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports=router;