const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken");
const User = require("../models/User");
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to DB
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser=await newUser.save();

    // console.log(newUser);

    res.status(201).json(savedUser);
  }catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json("Server error. Please try again.");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await User.findOne({ username }).populate('posts');;

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: false, // Update this if you have an admin flag in your schema
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // Exclude the password from the response
    const { password: userPassword, ...userInfo } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment for production with HTTPS
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json("Login failed. Please try again.");
  }
};
const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
module.exports = { register,login,logout };