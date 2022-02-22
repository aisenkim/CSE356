const express = require("express")
const router = express.Router();

const tttController = require("../controller/tttController")

router.get("/", tttController.helloWorld)
router.post("/ttt/", tttController.postName)
router.post("/ttt/play", tttController.playGame)

module.exports = router