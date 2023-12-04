const express = require("express");
const app = express();
require("dotenv").config();
let dbConnect = require("./dbConnect");

// Routes
app.use(express.json());

const dogBreedRoutes = require("./routes/dogBreedRoutes");
app.use("/api/dogs/breeds", dogBreedRoutes);

const dogImageRoutes = require("./routes/dogImageRoutes");
app.use("/api/dogs/images", dogImageRoutes);

// parse requests of content-type -application/json
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my MySQL application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on
port ${PORT}.`);
});