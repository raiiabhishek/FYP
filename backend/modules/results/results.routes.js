const express = require("express");
const auth = require("../../middleware/auth");
const resultRouter = express.Router();
const createResult = require("./createResult");
const editResult = require("./editResult");
const delResult = require("./delResult");
const getResultByModule = require("./getResultByModule");
const getResultByStd = require("./getResultByStd");

resultRouter.get("/module/:moduleId", getResultByModule);
resultRouter.get("/std/:moduleId/:studentId", getResultByStd);
resultRouter.use(auth);
resultRouter.post("/create", createResult);
resultRouter.patch("/edit/:resultId", editResult);
resultRouter.delete("/delete/:resultId", delResult);
module.exports = resultRouter;
