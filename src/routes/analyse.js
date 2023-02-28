const { Router } = require("express");
const controllerApp = require("../controllers/controllerApp");

const router = new Router();

router.post("/", controllerApp.analyse);

module.exports = router;
