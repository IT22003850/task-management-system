const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("./middlewares/passport");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const PORT = process.env.PORT || 5000;

const app = express(); //Initialize Express App

// Set Up CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
); //enables cookies/session handling

//Middlewares
app.use(express.json()); //parses incoming JSON requests.

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
); //sets up server-side sessions.

app.use(passport.initialize()); //setup authentication handling
app.use(passport.session());

//Connects to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


//Set Up Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

//Starts the Express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
