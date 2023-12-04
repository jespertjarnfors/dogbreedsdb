'use strict'
const DogBreed = require('./dogBreed')
const DogImage = require('./dogImage')

// Defining associations
DogImage.belongsTo(DogBreed, { foreignKey: 'breedId' });
DogBreed.hasMany(DogImage, { foreignKey: 'breedId' });

async function init() {
 await DogBreed.sync();
 await DogImage.sync();
};

init();
module.exports = {
DogBreed, DogImage
};
