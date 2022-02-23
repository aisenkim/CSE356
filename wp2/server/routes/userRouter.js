const express = require("express")
const router = express.Router();

const userController = require("../controller/userController")
const Auth = require("../middleware/authMiddleware")

router.post("/login", userController.login)
router.post("/logout",  userController.logout)
router.post('/adduser', userController.adduser)

module.exports = router;