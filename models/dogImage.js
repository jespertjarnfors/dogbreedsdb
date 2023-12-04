const { DataTypes, Model } = require("sequelize");
const dbConnect = require("../dbConnect");

class DogImage extends Model {}

DogImage.init(
  {
    imageId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnect.Sequelize,
    modelName: "dogImages",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = DogImage;
