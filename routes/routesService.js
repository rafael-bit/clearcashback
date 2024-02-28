const router = require("express").Router();
const userController = require("../controllers/User");

router.route("/services").post((req, res) => userController.create(req, res));
router.route("/services").get((req, res) => userController.getAll(req, res))
router.route("/services/:id").get((req, res) => userController.get(req, res));
router.route("/services/:id").delete((req, res) => userController.delete(req, res))
router.route("/services/:id").put((req, res) => userController.put(req, res))

module.exports = router;
