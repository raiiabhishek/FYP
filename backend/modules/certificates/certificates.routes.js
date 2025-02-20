const express = require("express");
const auth = require("../../middleware/auth");
const createCertificate = require("./createCertificate");
const getCertificate = require("./getCertificate");
const certificateRouter = express.Router();
certificateRouter.get("/:courseName/:certificateId", getCertificate);
certificateRouter.use(auth);
certificateRouter.post("/create", createCertificate);
module.exports = certificateRouter;
