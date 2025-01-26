const express = require("express");
const auth = require("../../middleware/auth");
const getEvents = require("./getEvents");
const getEventById = require("./getEventById");
const createEvent = require("./createEvent");
const editEvent = require("./editEvent");
const deleteEvent = require("./delEvent");
const eventRouter = express.Router();

eventRouter.get("/", getEvents);
eventRouter.get("/getEvent/:eventId", getEventById);
eventRouter.use(auth);
eventRouter.post("/create", createEvent);
eventRouter.patch("/edit/:eventId", editEvent);
eventRouter.delete("/delete/:eventId", deleteEvent);

module.exports = eventRouter;
