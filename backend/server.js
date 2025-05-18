const dotenv = require("dotenv");
const path = require("path");

// Load .env file 
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Debug environment variables
console.log("Environment Variables Loaded:");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not Set");
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("PORT:", process.env.PORT);

// Check if critical variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set. Check .env file."
  );
  process.exit(1);
}

const express = require("express");
const mongoose = require("mongoose");
const passport = require("./middlewares/passport");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express(); //Initialize Express App

// Set Up CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "https://your-frontend.netlify.app"],
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
