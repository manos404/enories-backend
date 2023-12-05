const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const polygonSchema = new Schema({
  type: {
    type: String,
    default: "Feature",
  },
  geometry: {
    type: {
      type: String,
      default: "Polygon",
    },
    coordinates: [
      [
        { type: Number, required: true },
        { type: Number, required: true },
      ],
    ],
  },
  properties: {
    name: { type: String, required: true },
  },
});
const PolygonModel = mongoose.model(
  "PolygonDocument",
  polygonSchema,
  "Polygons"
);

module.exports = {
  PolygonModel,
};
