var eventNewView = Backbone.View.extend ({
	tagName: "div",

	events: {
		"submit #new-event-form": "create"
	},

	initialize: function() {
		this.listenTo(app.eventList, 'add', this.showEventList);
	},

	render: function() {
		var data = {
			types: app.eventType
		};

		this.$el.html( app.hookTemplate("event-new", data) );
		return this;
	},

	create: function() {
		var summaryInput = $("#summary");
		if(!summaryInput.val()) {
			summaryInput.parent().addClass('has-error');
			summaryInput.focus();
			return false;
		}

		var summary = summaryInput.val();
		var detail = $("#detail").html();
		var type = $("#type").val();

		var model = new app.eventModel({
			"detail" : detail,
			"summary": summary,
			"type": type,
			"typeLabel": app.eventType[type],
		});

		model.save(null, {
			wait: true,
			success: function(res) {
				app.eventList.add(res);
			}
		});
		return false;
	},

	showEventList: function() {
		var list = new eventListView();
		var nav = new navView();
        $("#nav").html( nav.render().el );
		$("#main").html( list.render().el );
	}
});