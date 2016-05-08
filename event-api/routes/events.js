var mongojs = require("mongojs");
var express = require("express");
var validator = require('express-validator');
var router = express.Router();

var auth = require("../auth");
var config = require("../config");

var db = mongojs('eventmanager', ['events']);

// Get statuses
router.get("/statuses", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.status);
});

// Get types
router.get("/types", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.type);
  //Need to add new table document for flexible types
});

//Get all events
router.get("/", auth.ensureAuth(), function(req, res) {
	db.events.find({}, function(err, data) {
		res.status(200).json(data);
	});
});

//Get one event
router.get("/:id", auth.ensureAuth(), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Event ID").isMongoId();
	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	db.events.findOne({_id: mongojs.ObjectId(iid)}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

//Create a new event
router.post("/", auth.ensureRole(1), function(req, res) {
	//TODO: need coding to create new event
});

//Update an event
router.put("/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to update an event
});

//Delete an event
router.delete("/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to delete an event
});

//Close an event
router.patch("/close/:id", auth.ensureSuper(), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to close an event
});

//Comments
router.post("/comments", auth.ensureAuth(), function(req, res) {
	//TODO: need coding to add comments
});

router.delete("/comments", auth.ensureAuth(), function(req, res) {
	//TODO: need coding to delete comments
});

module.exports = router;