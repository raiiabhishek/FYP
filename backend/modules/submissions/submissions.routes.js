const express = require("express");
const auth = require("../../middleware/auth");
const getSubmissionById = require("./getSubmissionById");
const uploadMiddleware = require("../../middleware/upload");
const createSubmission = require("./createSubmission");
const editSubmission = require("./editSubmission");
const delSubmission = require("./delSubmission");
const submissionRouter = express.Router();

submissionRouter.get("/geeetSubmission/:submissionId", getSubmissionById);
submissionRouter.use(auth);
submissionRouter.post(
  "/:assignmentId/create",
  uploadMiddleware,
  createSubmission
);
submissionRouter.patch(
  "/:assignmentId/edit/:submissionId",
  uploadMiddleware,
  editSubmission
);
submissionRouter.delete("/:submissionId", delSubmission);

module.exports = submissionRouter;
