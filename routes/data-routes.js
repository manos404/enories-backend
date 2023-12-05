const express = require("express");
const controllers = require("../controllers/data-controllers");

const router = express.Router();

router.get("/data", controllers.getAllData);

router.post("/marker/", controllers.createMarker);
router.patch("/marker/:mid", controllers.updateMarker);
router.delete("/marker/:mid", controllers.deleteMarker);

router.post("/polygon/", controllers.createPolygon);
router.patch("/polygon/:pid", controllers.updatePolygon);
router.delete("/polygon/:pid", controllers.deletePolygon);

router.post("/login", controllers.login);
module.exports = router;
// οταν εχουμε async kanoyme next(error) se sync kanoyme throw..
//otan kanoume next (error) an meta uparxei kapoio res .tote mporsta apo to next bazoume return


 