const { Router } = require("express");
const submitRouter = Router();
const ownerController = require("../controllers/ownerController.js");

submitRouter.post("/owner", ownerController.getCommits);

module.exports = submitRouter;
