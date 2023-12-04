const express = require('express');
const router = express.Router();
const dogBreedController = require('../controllers/dogBreedController');

// Route to fetch and store dog breeds
router.get('/fetch', async (req, res) => {
  await dogBreedController.fetchDataAndStoreDogBreeds();
  res.send('Dog breeds fetched and stored!');
});

// Route to get all dog breeds
router.get("/", dogBreedController.getDogBreeds);

// Route to update a dog breed
router.put('/update/:breedId', async (req, res) => {
  await dogBreedController.updateDogBreed(req, res);
});

// Route to delete a dog breed
router.delete('/delete/:breedId', async (req, res) => {
  await dogBreedController.deleteDogBreed(req, res);
});

module.exports = router;
