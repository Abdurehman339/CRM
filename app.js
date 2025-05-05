const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const responseInterceptor = require("./src/middlewares/response.interceptor");
const cors = require("cors");
require("dotenv").config();
const app = express();

const authRoutes = require("./src/modules/auth/routes/auth.routes");
const mailRoutes = require("./src/modules/mail/routes/mail.routes");
const userRoutes = require("./src/modules/user/routes/user.routes");

app.use(responseInterceptor);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the Express app!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/user", userRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.send({ status: "Server is healthy!" });
});

//DB connection
connectDB();

module.exports = app;
