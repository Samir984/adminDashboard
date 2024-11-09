const express = require("express");
const {
  register,
  login,
  getAllUser,
  updateUser,
  deleteUser,
  myDetail,
  logout,
} = require("../controller/user.controller");
const verifyJwt = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.get("", verifyJwt, getAllUser);
userRouter.get("/me", verifyJwt, myDetail);
userRouter.post("/register", register); // Register route
userRouter.post("/login", login); // Login route
userRouter.post("/logout", logout); // Login route

userRouter.put("/:id", verifyJwt, updateUser); // Update user route (Admin only)
userRouter.delete("/:id", verifyJwt, deleteUser); // Delete user route (Admin only)

module.exports = userRouter;
