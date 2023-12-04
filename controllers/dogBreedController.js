const axios = require('axios');
const Models = require("../models");
const { DogBreed } = require('../models')

const fetchDataAndStoreDogBreeds = async () => {
  try {
    // Fetch the list of dog breeds
    const breedResponse = await axios.get('https://api.thedogapi.com/v1/breeds');

    // Extract the first 100 breeds
    const first100Breeds = breedResponse.data.slice(0, 100).map((breed) => ({
      breedId: breed.id,
      name: breed.name,
      origin: breed.origin,
      temperament: breed.temperament,
    }));

    // Create/update the DogBreeds in the database
    await DogBreed.bulkCreate(first100Breeds, {
      updateOnDuplicate: ['name', 'origin', 'temperament'],
    });

    console.log('Data fetched and stored successfully!');
  } catch (error) {
    console.error('Error fetching or storing data:', error.message);
  }
};

const getDogBreeds = async (req, res) => {
  try {
    const dogBreeds = await Models.DogBreed.findAll();
    res.send({ status: 200, data: dogBreeds });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 500, error: err.message });
  }
};

// Update a dog breed
const updateDogBreed = async (req, res) => {
  const { breedId } = req.params;
  const updatedData = req.body;

  try {
    const [updatedRows] = await Models.DogBreed.update(updatedData, {
      where: { breedId },
    });

    if (updatedRows > 0) {
      res.json({
        success: true,
        message: 'Dog breed updated successfully',
        result: [updatedRows],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Dog breed not found or no updates applied',
        result: [],
      });
    }
  } catch (error) {
    console.error('Error updating dog breed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      result: [],
    });
  }
};

// Delete a dog breed
const deleteDogBreed = async (req, res) => {
  const { breedId } = req.params;

  try {
    const deletedRows = await Models.DogBreed.destroy({
      where: { breedId },
    });

    if (deletedRows > 0) {
      res.json({
        success: true,
        message: 'Dog breed deleted successfully',
        result: deletedRows,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Dog breed not found or no deletion applied',
        result: 0,
      });
    }
  } catch (error) {
    console.error('Error deleting dog breed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      result: 0,
    });
  }
};

module.exports = {
  fetchDataAndStoreDogBreeds,
  getDogBreeds,
  updateDogBreed,
  deleteDogBreed,
};
