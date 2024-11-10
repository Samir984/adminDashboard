require("dotenv").config({ path: ".env.local" });
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const userRouter = require("./route/user.route");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("hello");
});
app.use("/api/users", userRouter);

connectDB().then((res) => {
  if (res) {
    // Only start server if database connection is successful
    app.listen(8080, () => {
      console.log("Server started listening 🗄️ on http://localhost:8080\n\n");
    });
  } else {
    console.log("Server not started due to database connection failure.");
  }
});
