const express = require( "express");
const {verifyToken} = require( "../middleware/verifyToken.js");
const { addPost, deletePost, getPost, getPosts, updatePost } = require( "../controllers/post.controller.js");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports= router;