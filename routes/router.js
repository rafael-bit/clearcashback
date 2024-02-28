const router = require("express").Router();
const serviceRouter = require("./routesService");
const { login, create, getAll, get, delete: deleteUser, put } = require("../controllers/User");

router.post("/login", login);
router.post("/create", create);

router.use("/services", authenticateToken, serviceRouter);
router.get("/user/:id", authenticateToken, get);
router.delete("/user/:id", authenticateToken, deleteUser);
router.put("/user/:id", authenticateToken, put);
router.get("/all", authenticateToken, getAll);

module.exports = router;