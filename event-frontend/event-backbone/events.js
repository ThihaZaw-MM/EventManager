app.eventModel = Backbone.Model.extend({
	urlRoot: app.api("/events"),
	defaults: {
		"eventName" : null,
		"eventDescription" : null,
		"startDate" : null,
		"endDate" : null,
		"startTime" : null,
		"endTime" : null,
		"latitude" : 0,
		"longitude" : 0,
		"mapurl" : null,
		"enquireNumber" : null,
		"enquierEmail" : null,
		"status" : 0,
		"statusLabel" : "New",
		"summary" : null,
		"type" : 0,
		"typeLabel" : "Showcase",
	},
	idAttribute: "_id"
});

app.eventCollection = Backbone.Collection.extend({
	model: app.eventModel,
	url: app.api("/events")
});

app.eventList = new app.eventCollection();