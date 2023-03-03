const { Router } = require("express");
const controllerApp = require("../controllers/controllerApp");

const router = new Router();

router.post("/analyse", controllerApp.analyse);
router.post("/optimize", controllerApp.optimize);

module.exports = router;
