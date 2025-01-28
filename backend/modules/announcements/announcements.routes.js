const express = require("express");
const auth = require("../../middleware/auth");
const getAnnouncements = require("./getAnnouncements");
const getAnnouncementById = require("./getAnnouncementById");
const getAnnouncementByCourse = require("./getAnnouncementByCOurse");
const createAnnouncement = require("./createAnnouncement");
const editAnnouncement = require("./editAnnouncement");
const delAnnouncement = require("./delAnnouncement");
const announcementRouter = express.Router();

announcementRouter.get("/", getAnnouncements);
announcementRouter.get("/getAnnouncement/:announcementId", getAnnouncementById);
announcementRouter.get("/course/:course", getAnnouncementByCourse);
announcementRouter.use(auth);
announcementRouter.post("/create", createAnnouncement);
announcementRouter.patch("/edit/:announcementId", editAnnouncement);
announcementRouter.delete("/delete/:announcementId", delAnnouncement);

module.exports = announcementRouter;
