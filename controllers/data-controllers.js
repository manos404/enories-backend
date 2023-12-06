const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
// const Marker = require("../models/marker");
// const Polygon = require("../models/polygon");
const { MarkerModel } = require("../models/marker");
const { PolygonModel } = require("../models/polygon");
const { UserModel } = require("../models/user");

const admins = [
  {
    username: "admin",
    password: "admin123",
  },
];

let data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [35.205086209786394, 25.158477039367572],
          [35.19921618292286, 25.172693571576197],
          [35.21687361475338, 25.131310270052676],
          [35.22693, 25.15462],
          [35.23263, 25.17037],
          [35.230957581128564, 25.177845552861488],
          [35.23789, 25.17173],
          [35.2589101148275, 25.18705143197222],
          [35.24527, 25.16618],
          [35.24916919354481, 25.15361262032802],
          [35.23656, 25.13971],
          [35.23429557335186, 25.177754252861572],
          [35.205086209786394, 25.158477039367572],
        ],
      },
      properties: {
        name: "ΕΝΟΡΙΑ ΑΝΩ ΑΡΧΑΝΩΝ",
        id: "no1",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [35.238026, 25.159381],
      },
      properties: {
        id: "p2",
        name: "Ιερός Ναός Κοιμήσεως Της Θεοτόκου",
        parish: "ΕΝΟΡΙΑ ΑΝΩ ΑΡΧΑΝΩΝ",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [35.237821, 25.159196],
      },
      properties: {
        id: "p3",
        name: "Ιερός Ναός Αγίου Αντωνίου",
        parish: "ΕΝΟΡΙΑ ΑΝΩ ΑΡΧΑΝΩΝ",
      },
    },
  ],
};

const getAllData = async (req, res, next) => {
  let  features=[] ;
  try {
    const polygons = await PolygonModel.find({});
    const markers = await MarkerModel.find({});
console.log(polygons)
console.log(markers)
    features  = polygons.concat(markers)
  } catch (err) {
    const error = new HttpError("Σφάλμα κατά την ανάκτηση των δεδομένων:", 500);
    return next(error);
  }
  features =  features.map((p) =>
    p.toObject({ getters: true })
  );
  res.status(200).json({ features});
};

const createMarker = async (req, res, next) => {
  const { name, coordinates, parish } = req.body;
  const createdMarker = new MarkerModel({
    properties: { name: name, id: uuidv4(), parish: parish },
    geometry: { coordinates: coordinates },
  });
  try {
    await createdMarker.save();
  } catch (err) {
    const error = new HttpError(
      "Creating marker failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ marker: createdMarker });
};

const updateMarker = async (req, res, next) => {
  const { name, coordinates, parish } = req.body;
  const id = req.params.mid;
  let marker;
  try {
    marker = await MarkerModel.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not update the marker",
      500
    );
    return next(error);
  }
  marker.properties.name = name;
  marker.geometry.coordinates = coordinates;
  marker.properties.parish = parish;
  console.log(marker);
  try {
    await marker.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not update the marker",
      500
    );
    return next(error);
  }

  res.status(200).json({ marker: marker.toObject({ getters: true }) });
};

const deleteMarker = async (req, res, next) => {
  const id = req.params.mid;
  let marker;
  try {
    marker = await MarkerModel.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not delete the marker",
      500
    );
    return next(error);
  }
  try {
    await marker.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not delete the marker",
      500
    );
    console.log("deleted")
    return next(error);
  }

  res.status(200).json({ message: "deleted place" });
};

const createPolygon = async (req, res, next) => {
  const { name, coordinates } = req.body;
  console.log(coordinates)
  const createdPolygon = new PolygonModel({
    properties: { name: name, id: uuidv4() },
    geometry: { coordinates: coordinates },
  });

  try {
    await createdPolygon.save();
  } catch (err) {
    const error = new HttpError(
      "Creating polygon failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ polygon: createdPolygon });
};

const updatePolygon = async (req, res, next) => {
  const { name, coordinates } = req.body;
  const id = req.params.pid;
  let polygon;
  try {
    polygon = await PolygonModel.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not update the polygon",
      500
    );
    return next(error);
  }
  polygon.properties.name = name;
  polygon.geometry.coordinates = coordinates;
  try {
    await polygon.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not update the polygon",
      500
    );
    return next(error);
  }

  res.status(200).json({ feature: polygon });
};

const deletePolygon = async (req, res, next) => {
  const id = req.params.pid;
  let polygon;
  try {
    polygon = await PolygonModel.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not delete the polygon",
      500
    );
    return next(error);
  }
  try {
    await polygon.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not delete the polygon",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "deleted polygon" });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Logging failed ,please try again later", 500);
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials,could not log in", 401);
    return next(error);
  }

  res.json({ message: "Logged in!" });
};
// const login = (req, res, next) => {
//   const { username, password } = req.body;
//   const identifiedUser = admins.find((u) => {
//     return u.username === username;
//   });
//   if (!identifiedUser || identifiedUser.password !== password) {
//     throw new HttpError("could not identify user", 401);
//   }
//   res.json({ message: "Logged in!" });
// };

exports.getAllData = getAllData;
exports.createMarker = createMarker;
exports.updateMarker = updateMarker;
exports.deleteMarker = deleteMarker;

exports.createPolygon = createPolygon;
exports.updatePolygon = updatePolygon;
exports.deletePolygon = deletePolygon;

exports.login = login;
 
