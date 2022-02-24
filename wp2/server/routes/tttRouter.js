const express = require("express")
const router = express.Router();
const Auth = require("../middleware/authMiddleware")

const tttController = require("../controller/tttController")

router.get("/", tttController.helloWorld)
router.post("/ttt/", tttController.postName)
router.post("/ttt/play", Auth.isAuthenticated, tttController.playGame)

module.exports = router