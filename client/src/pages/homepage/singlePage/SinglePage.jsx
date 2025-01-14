import "./singlePage.scss";
import Slider from "../../../components/navbar/slider/Slider";
import Map from "../../../components/navbar/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";


function SinglePage() {

  const post=useLoaderData();
  // console.log(post);
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

   useEffect(() => {
    const fetchSavedStatus = async () => {
      if (currentUser) {
        try {
          const response = await apiRequest.get(`/users/savedStatus/${post._id}`);
          setSaved(response.data.saved);  // Assuming backend returns { saved: true/false }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchSavedStatus();
  }, [currentUser, post._id]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      const data=await apiRequest.post("/users/save", { postId: post._id });
      console.log(data)
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
  if (!currentUser) {
    navigate("/login");
    return;
  }
  if (!post.userId || !post.userId._id) {
    console.error("Invalid receiverId. Cannot send message.");
    return;
  }

  const receiverId = post.userId._id;
  console.log("Receiver ID:", receiverId);
  console.log("Current User ID:", currentUser._id);

  try {
    const res = await apiRequest.post("/chats", { receiverId });

    const chatId = res.data._id; 
    console.log(chatId); // Get chat ID from the response
    navigate(`/profile?chatId=${chatId}`); // Redirect to profile with chat ID
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">PKR {post.price}</div>
              </div>
              <div className="user">
                <img src={post.userId.avatar || "noavatar.jpg"} alt="" />
                <span>{post.userId.username}</span>
              </div>
            </div>
            <div className="bottom">{post.postDetails.desc}</div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetails.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetails.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetails.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetails.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>250m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                 <p>
                  {post.postDetails.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetails.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>200m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map key={post._id} items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SinglePage;