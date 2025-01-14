import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../../context/SocketContext";
import { useNotificationStore } from "../../../lib/notificationStore";

function Chat({ chats: initialChats, initialChatId }) {
  const [chats, setChats] = useState(initialChats); // Local state for chats
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);
  const increment = useNotificationStore((state) => state.increment);
  const fetch = useNotificationStore((state) => state.fetch);

  useEffect(() => {
    fetch(); // Fetch initial notification count

    if (!socket) return;

    // Listen for new notifications
    const handleNewNotification = () => {
      increment(); // Increment notification count
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, fetch, increment]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Automatically open a chat if an `initialChatId` is provided
  useEffect(() => {
    if (initialChatId) {
      const targetChat = chats.find((c) => c._id === initialChatId);
      if (targetChat) {
        handleOpenChat(targetChat._id, targetChat.receiver);
      }
    }
  }, [initialChatId, chats]);

  
const handleOpenChat = async (id, receiver) => {
  try {
    const res = await apiRequest.get("/chats/" + id);
    
    if (res.data.seenBy.includes(currentUser._id)) {
      decrease();
    }

    // Set the chat and receiver data
    setChat({ ...res.data, receiver });
  } catch (err) {
    console.error(err);
  }
};


  // Function to send a message
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat._id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      // Emit the message to the server
      socket.emit("sendMessage", {
        receiverId: chat.receiver._id,
        data: res.data,
      });

      // Update the chat bar with the latest message
      setChats((prev) =>
        prev.map((c) =>
          c._id === chat._id
            ? { ...c, lastMessage: text, updatedAt: res.data.createdAt }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Real-time updates for messages and chat bar
useEffect(() => {
  if (!socket) return;

  const handleMessage = (data) => {
    // Update the currently opened chat
    if (chat && chat._id === data.chat) {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data],  // Add the new message
      }));
    }

    // Update the chat bar with new message details
    setChats((prev) =>
      prev.map((c) =>
        c._id === data.chat
          ? {
              ...c,
              lastMessage: data.text,
              updatedAt: data.createdAt,
              seenBy:
                c._id === chat?._id ? [...c.seenBy, currentUser._id] : [],
            }
          : c
      )
    );
  };

  // Listen for incoming messages
  socket.on("getMessage", handleMessage);

  // Clean up the socket listener when the component unmounts
  return () => {
    socket.off("getMessage", handleMessage);
  };
}, [socket, chat, currentUser._id]);


  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
          className="message"
          key={c._id}
          style={{
            backgroundColor:
              c.seenBy.includes(currentUser._id) || chat?._id === c._id
                ? "white"
                : "#fecd514e",  // Message color when not seen
          }}
          onClick={() => handleOpenChat(c._id, c.receiver)}  // Open chat on click
        >
          <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
          <span>{c.receiver.username}</span>
          <p>{c.lastMessage}</p>
        </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser._id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser._id ? "right" : "left",
                }}
                key={message._id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type your message..."></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
