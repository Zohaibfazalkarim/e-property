const jwt = require("jsonwebtoken");
const Post = require("../models/Post"); 
const SavedPost = require("../models/SavedPost"); 
const PostDetail=require("../models/PostDetails");
const User = require("../models/User");


// GET all posts with query filters
const getPosts = async (req, res) => {
  try {
    // Extract query parameters and conditionally build the filter object
    const filter = {
      ...(req.query.city && { city: req.query.city }),
      ...(req.query.type && { type: req.query.type }),
      ...(req.query.property && { property: req.query.property }),
      ...(req.query.bedroom && { bedroom: parseInt(req.query.bedroom) }),
      ...(req.query.minPrice || req.query.maxPrice ? {
        price: {
          ...(req.query.minPrice && { $gte: parseInt(req.query.minPrice) }),
          ...(req.query.maxPrice && { $lte: parseInt(req.query.maxPrice) }),
        },
      } : {}),
    };

    // Query the database
    const posts = await Post.find(filter);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
// GET a single post by ID
const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id)
      .populate("userId", "username avatar")
      .populate("postDetails")
      .exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await SavedPost.findOne({
            postId: id,
            userId: payload.id,
          }).exec();
          return res.status(200).json({ ...post.toObject(), isSaved: !!saved });
        }
      });
    } else {
      res.status(200).json({ ...post.toObject(), isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};


const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;
  console.log(tokenUserId)

  try {
    // 1. Create the Post first
    const newPost = new Post({
      ...postData,
      userId: tokenUserId, // Associate with the logged-in user
    });

    const savedPost = await newPost.save();
    console.log("Before update:", await User.findById(tokenUserId));

    // 2. Add the post to the user's posts array
    await User.findByIdAndUpdate(
      tokenUserId,
      { $push: { posts: savedPost._id } },
      { new: true }
    );
    console.log("After update:", await User.findById(tokenUserId));

    // 3. Create PostDetail with a reference to the saved Post
    const newPostDetail = new PostDetail({
      ...postDetail,
      post: savedPost._id, // Link the PostDetail to the saved Post
    });

    const savedPostDetail = await newPostDetail.save();

    // 4. Update the Post to link to the saved PostDetail
    savedPost.postDetails = savedPostDetail._id; // Link the Post with its PostDetail
    await savedPost.save(); // Save the Post with the reference to PostDetail

    // 5. Return the saved post with postDetails
    res.status(200).json(savedPost);
  } catch (err) {
    console.error("Error saving post:", err.message);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};


// PUT update a post
const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id).exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE a post
const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id).exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await Post.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Export the functions
module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
};
