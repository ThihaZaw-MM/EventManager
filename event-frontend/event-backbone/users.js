app.userModel = Backbone.Model.extend({
	urlRoot: app.api("/users"),
	idAttribute: "_id"
});

app.userCollection = Backbone.Collection.extend({
	model: app.userModel,
	url: app.api("/users")
});

app.userList = new app.userCollection();