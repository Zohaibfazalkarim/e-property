const express =require("express");
const dotenv =require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute =require ("./routes/auth.route");
const testRoute =require ("./routes/test.route");
const userRoute =require ("./routes/user.route");
const postRoute=require("./routes/post.route");
const chatRoute=require("./routes/chat.route")
const messageRoute=require("./routes/message.route");
const app = express();
dotenv.config();
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });
  

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});