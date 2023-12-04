const express = require("express");
const router = express.Router();
const dogImageController = require("../controllers/dogImageController");

// Route to fetch and store dog images
router.get("/fetch", async (req, res) => {
  await dogImageController.fetchAndStoreDogImages();
  res.send("Dog images fetched and stored!");
});

// Route to get all dog images
router.get("/", dogImageController.getDogImages);

// Route to update a dog image record
router.put("/update/:imageId", async (req, res) => {
  await dogImageController.updateDogImage(req, res);
});

// Route to delete a dog image record
router.delete("/delete/:imageId", async (req, res) => {
  await dogImageController.deleteDogImage(req, res);
});

module.exports = router;
