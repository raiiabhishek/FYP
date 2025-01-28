const express = require("express");
const auth = require("../../middleware/auth");
const groupRouter = express.Router();

const createGroup = require("./createGroup");
const editGroup = require("./editGroup");
const deleteGroup = require("./deleteGroup");
const getGroups = require("./getGroups");
const getGroupById = require("./getGroupById");
const getGroupsByCourse = require("./getGroupsByCourse");

groupRouter.get("/", getGroups);
groupRouter.get("/getGroup/:groupId", getGroupById);

groupRouter.use(auth);
groupRouter.get("/teacher/", getGroupsByCourse);
groupRouter.post("/create", createGroup);
groupRouter.patch("/edit/:groupId", editGroup);
groupRouter.delete("/delete/:groupId", deleteGroup);

module.exports = groupRouter;
