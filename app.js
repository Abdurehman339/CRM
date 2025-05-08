const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const responseInterceptor = require("./src/middlewares/response.interceptor");
const cors = require("cors");
require("dotenv").config();
const app = express();
const errorHandler = require("./src/middlewares/error.handler");

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
app.use("/api/auth", require("./src/modules/auth/routes/auth.routes"));
app.use("/api/mail", require("./src/modules/mail/routes/mail.routes"));
app.use("/api/user", require("./src/modules/user/routes/user.routes"));
app.use("/api/hrm/member", require("./src/modules/hrm/routes/member.routes"));
app.use("/api/hrm/holiday", require("./src/modules/hrm/routes/holiday.routes"));

app.get("/api/health", (req, res) => {
  res.send({ status: "Server is healthy!" });
});

app.use(errorHandler);

//DB connection
connectDB();

module.exports = app;
