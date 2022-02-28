const express = require("express");
const router = express.Router();
const Auth = require("../middleware/authMiddleware");

const tttController = require("../controller/tttController");

router.get("/", tttController.helloWorld);
router.get("/ttt/play", tttController.getPlay);
router.post("/ttt/", tttController.postName);
router.post("/ttt/play", Auth.isAuthenticated, tttController.playGame);
router.post("/listgames", Auth.isAuthenticated, tttController.listGame);
router.post("/getgame", Auth.isAuthenticated, tttController.getGame);
router.post("/getscore", Auth.isAuthenticated, tttController.getScore);

module.exports = router;
