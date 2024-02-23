const router = require("express").Router();

const serviceRouter = require("./routesService");
router.use("/", serviceRouter);

module.exports = router;
