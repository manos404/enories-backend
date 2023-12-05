const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const markerSchema = new Schema({
  type: {
    type: String,
    default: "Feature",
  },
  geometry: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [
      { type: Number, required: true },
      { type: Number, required: true },
    ],
  },
  properties: {
    name: { type: String, required: true },
    parish: { type: String, required: true },
  },
});

// Δημιουργία των μοντέλων για τα δύο schemas

const MarkerModel = mongoose.model("MarkerDocument", markerSchema, "Markers");

module.exports = {
  MarkerModel,
};
