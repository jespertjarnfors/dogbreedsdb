require("dotenv").config();
const axios = require("axios");
const Models = require("../models");
const apiKey = process.env.API_KEY;

// Declaring storedDogImages as an empty array (needed for scope)
let storedDogImages = [];

// Fetching the data from the API and storing it in the database
const fetchAndStoreDogImages = async () => {
  try {
    // Fetch dog breeds data
    const dogBreeds = await Models.DogBreed.findAll({ raw: true });

    for (const breed of dogBreeds) {
      // Extract breed IDs
      const breedId = breed.breedId;

      // Fetch dog images data based on all breed IDs
      const dogImagesData = await fetchDogImagesData([breedId]);

      // Store dog images with the corresponding breedId
      storedDogImages = await storeDogImages(dogImagesData, breedId);
      console.log(`Dog images fetched and stored successfully for breedId: ${breedId}`);
    }

    return storedDogImages;

  } catch (error) {
    console.error("Error fetching and storing dog images:", error.message);
    throw error;
  }
};

// Fetch the images with the dynamic url based on the breedIds in the database
const fetchDogImagesData = async (breedIds) => {
  try {
    // Fetch dog images data based on all breedIds
    const response = await axios.get(
      `https://api.thedogapi.com/v1/images/search?limit=100&breed_ids=${breedIds.join(",")}&api_key=${apiKey}`);
    console.log(response.data);

    // Extract relevant image data
    const dogImagesData = response.data.map(({ id, url, width, height }) => ({
      imageId: id,
      url,
      width,
      height,
    }));

    return dogImagesData;
  } catch (error) {
    console.error("Error fetching dog images data:", error.message);
    throw error;
  }
};

// Storing the images after they have been fetched
const storeDogImages = async (dogImagesData, breedId) => {
  try {
    // Add breedId to each dog image data
    const dogImagesDataWithBreedId = dogImagesData.map((image) => ({ ...image, breedId }));

    // Store dog images
    const createdDogImages = await Models.DogImage.bulkCreate(dogImagesDataWithBreedId, {
      updateOnDuplicate: ["url", "width", "height", "breedId"],
    });
    console.log(createdDogImages);
    return createdDogImages;

  } catch (error) {
    console.error("Error storing dog images:", error.message);
    throw error;
  }
};

// Get all dog images
const getDogImages = async (req, res) => {
    try {
      const dogImages = await Models.DogImage.findAll();
      res.send({ status: 200, data: dogImages });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: 500, error: err.message });
    }
  };

// Update a dog image
const updateDogImage = async (req, res) => {

    const { imageId } = req.params; // Using imageId as an identifier in the params

    const updatedData = req.body; // The data to update a record goes in the request body
  
    try {
      const [updatedRows] = await Models.DogImage.update(updatedData, {
        where: { imageId },
      });
  
      if (updatedRows > 0) {
        // Some validation to ensure that requests have to update at least 1 row in order to be successful
        res.json({
          success: true,
          message: 'Dog image updated successfully',
          result: [updatedRows],
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Dog image not found or no updates applied',
          result: [],
        });
      }

    } catch (error) {
      console.error('Error updating dog image:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        result: [],
      });
    }
  };

// Delete a dog image
const deleteDogImage = async (req, res) => {
    const { imageId } = req.params;
  
    try {
      const deletedRows = await Models.DogImage.destroy({
        where: { imageId },
      });
  
      if (deletedRows > 0) {
        res.json({
          success: true,
          message: 'Dog image deleted successfully',
          result: deletedRows,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Dog image not found or no deletion applied',
          result: 0,
        });
      }
    } catch (error) {
      console.error('Error deleting dog image:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        result: 0,
      });
    }
  };

module.exports = {
  fetchAndStoreDogImages, getDogImages, updateDogImage, deleteDogImage };
