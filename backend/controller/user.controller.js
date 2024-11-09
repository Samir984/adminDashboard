const User = require("../models/user.model");

const register = async function (req, res) {
  const { fullName, email, password, role } = req.body;
  console.log(req.body);

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log(fullName, email, "signup");

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "Account already exists, Please login" });
    }

    const createUser = await User.create({ fullName, email, password, role });
    if (!createUser) {
      return res
        .status(500)
        .json({ message: "User signup failed, please try again" });
    }

    // Exclude password from response
    createUser.password = "";

    return res.status(201).json(createUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Login function
const login = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the user is blocked, return an error
    if (user.isBlock) {
      return res.status(403).json({
        message: "Your account is blocked due to some reason",
      });
    }

    // Generate JWT token
    const token = await user.generateAccessToken();

    // Send the token in a cookie
    res.cookie("accessToken", token, {
      httpOnly: true, // The cookie is not accessible via JavaScript.
      secure: process.env.NODE_ENV === "production", // Use true for HTTPS in production.
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    });
    return res.status(200).json({
      token,
      user: { fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const myDetail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: err.message });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
};
const getAllUser = async (req, res) => {
  try {
    console.log("gellalluser controller");
    console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only!" });
    }

    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only!" });
    }

    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only!" });
    }

    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
// Export functions
module.exports = {
  register,
  login,
  myDetail,
  logout,
  getAllUser,
  updateUser,
  deleteUser,
};
