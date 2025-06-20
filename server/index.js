const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./connection.js");
const app = express();

const userRoute = require("./Routers/user");
const locationRoutes = require("./Routers/locationRoutes");

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Create HTTP server & socket

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

//Connect to MongoDB
connectToDatabase("mongodb://localhost:27017/Hospital-App");
app.use("/api", userRoute);
app.use("/admin", locationRoutes);
app.use("/uploads", express.static("uploads"));
