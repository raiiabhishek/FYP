const express = require("express");
const auth = require("../../middleware/auth");
const getModules = require("./getModules");
const getModuleById = require("./getModuleById");
const createModule = require("./createModule");
const editModule = require("./editModule");
const delModule = require("./delModule");
const getModulesByCourse = require("./getModuleByCourse");
const uploadMiddleware = require("../../middleware/upload");
const moduleRouter = express.Router();

moduleRouter.get("/", getModules);
moduleRouter.get("/course/:course", getModulesByCourse);
moduleRouter.get("/getModule/:moduleId", getModuleById);
moduleRouter.use(auth);
moduleRouter.post("/create", createModule);
moduleRouter.patch("/edit/:moduleId", editModule);
moduleRouter.delete("/delete/:moduleId", delModule);

module.exports = moduleRouter;
