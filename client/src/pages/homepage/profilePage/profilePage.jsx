import Chat from "../../../components/navbar/chat/Chat";
import List from "../../../components/navbar/list/List";
import "./profilePage.scss";
import apiRequest from "../../../lib/apiRequest";
import { Link, useLoaderData, useNavigate,useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

function ProfilePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
   const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  // console.log(chatId)

  const navigate = useNavigate();
  const data = useLoaderData();
  console.log(data)
 const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
       updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
            <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <List post={data.posts.userPosts}/>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List post={data.posts.savedPosts}/>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat chats={data.chats} initialChatId={chatId} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;