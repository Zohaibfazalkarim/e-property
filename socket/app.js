const { Server } =require("socket.io");

const allowedOrigins = 
  process.env.NODE_ENV === "production" 
    ? "https://your-vercel-project.vercel.app" // Production origin
    : "http://localhost:5173"; // Development origin

const io = new Server({
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUser = [];


const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(onlineUser)
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
    // Notify the recipient of a new message
    io.to(receiver.socketId).emit("newNotification", { chatId: data.chat });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000", () => {
  console.log("Server is running!");
});