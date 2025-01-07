const express=require("express");
const {
  getChats,
  getChat,
  addChat,
  readChat,
} =require ("../controllers/chat.contoller.js");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

module.exports= router;