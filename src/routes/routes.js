const express = require('express');
const router = express.Router();
const userController=require("../controllers/userController")
const authentication=require("../middleware/authentication")
const eventController=require("../controllers/eventController")
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.get("/logout",authentication.authenticate,userController.logoutUser)
router.put("/change-password",authentication.authenticate,userController.changePassword)
router.post("/reset",authentication.authenticate,userController.resetPassword)
router.put("/update",authentication.authenticate,userController.updatePassword)

router.post("/create-event",authentication.authenticate,eventController.createEvent)
router.post("/create-list",authentication.authenticate,eventController.createInviteList)
router.get("/get-list",authentication.authenticate,eventController.getEventDetails)
router.put("/update-event/:eventId",authentication.authenticate,eventController.updateEventDetails)
module.exports = router;