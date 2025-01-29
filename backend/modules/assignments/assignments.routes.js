const express = require("express");
const auth = require("../../middleware/auth");
const getAssignments = require("./getAssignments");
const getAssignmentsByModule = require("./getAssignmentsByModule");
const uploadMiddleware = require("../../middleware/upload");
const createAssignment = require("./createAssignment");
const editAssignment = require("./editAssignment");
const delAssignment = require("./delAssignment");
const assignmentRouter = express.Router();

assignmentRouter.get("/", getAssignments);
assignmentRouter.get("/module/:moduleId", getAssignmentsByModule);
assignmentRouter.use(auth);
assignmentRouter.post("/:moduleId/create", uploadMiddleware, createAssignment);
assignmentRouter.patch(
  "/:moduleId/edit/:assignmentId",
  uploadMiddleware,
  editAssignment
);
assignmentRouter.delete("/:assignmentId", delAssignment);

module.exports = assignmentRouter;
