
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ params }) => {
   
  const res = await apiRequest("/posts/" + params.id);
//   console.log(res.data)
  return res.data;
};
export const listPageLoader = async ({ request }) => {
  const query = request.url.split("?")[1];
//   console.log(query)
    const response =await apiRequest("/posts?"+query);
    //  console.log(JSON.stringify(response.data, null, 2));
    return response.data; // Pass data to useLoaderData
  }
 export const profilePageLoader = async () => {
  try {
    const postResponse = await apiRequest("/users/profilePosts");
    const chatResponse = await apiRequest("/chats");

    // Return both responses as an object
    return {
      posts: postResponse.data,
      chats: chatResponse.data,
    };
  } catch (err) {
    console.error("Error loading profile data:", err.message);
    throw new Error("Failed to load profile data");
  }
};

