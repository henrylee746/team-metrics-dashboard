const { Router } = require("express");
const submitRouter = Router();
const ownerController = require("../controllers/ownerController.js");
const teamController = require("../controllers/teamController.js");

submitRouter.post("/owner", ownerController.getCommits);
submitRouter.post("/team", teamController.getCommits);

module.exports = submitRouter;
