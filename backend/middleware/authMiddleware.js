const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJwt = async (req, res, next) => {
  console.log(req.url, "verifying jwt");

  // Retrieve token from cookies or Authorization header
  console.log(req.cookies);
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized request: Access Token not found" });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Find user by ID in the decoded token
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 3600000 * 24,
    });

    // Check if the user is blocked
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Your account is blocked due to some reason" });
    }

    // Set user in request for further use
    req.user = user;
    console.log("Auth successful");
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyJwt;
