var eventDetailView = Backbone.View.extend({
	tagName: "div",

	events: {
		"click #delete-event": "deleteEvent",
		"click #close-event": "closeEvent",
		"click #edit-event": "editEvent",
		"click .change-type": "changeType",
		"click .change-priority": "changePriority",
		"click .change-assign": "changeAssign",
		"click .change-status": "changeStatus",
		"click #post-comment": "postComment",
		"click .delete-comment": "deleteComment",
	},

	initialize: function() {
		//
	},

	render: function() {
		this.model.set("users", app.userList.toJSON());
		this.$el.html(app.hookTemplate("event-detail", this.model.toJSON()));
		return this;
	},

	deleteEvent : function() {
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		this.model.url = function() {
			return urlRoot + "/" + id;
		};

		this.model.destroy({
			wait: true,
			success: function() {
				var list = new eventListView();
				$("#main").html( list.render().el );
			}
		});
	},

	closeEvent: function() {
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		this.model.url = function() {
			return urlRoot + "/status/" + id;
		};
		this.model.save({
			status: 4,
			statusLabel: app.eventStatus[4]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var list = new eventListView();
				$("#main").html( list.render().el );
			}
		});
	},

	editEvent: function() {
		var edit = new eventEditView({model: this.model});
		$("#main").html( edit.render().el );
	},

	changeType: function() {
		var type = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		this.model.url = function() {
			return urlRoot + "/type/" + id;
		};

		this.model.save({
			type: type,
			typeLabel: app.eventType[type]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new eventDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	changeStatus: function(e) {
		var status = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		this.model.url = function() {
			return urlRoot + "/status/" + id;
		};

		this.model.save({
			status: status,
			statusLabel: app.eventStatus[status]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new eventDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	postComment: function() {
		var comment = $("#comment").val();
		if(!comment) return;

		var user = app.getUserInfo();
		var authorId = user._id;
		var authorName = user.fullName;

		var newComment = {
			comment: comment,
			authorId: authorId,
			authorName: authorName,
			submittedAt: new Date(),
			eventId: this.model.id
		};

		var comments = this.model.get("comments") || [];
		comments.push(newComment);

		var urlRoot = this.model.urlRoot;
		var that = this;
		$.post(urlRoot + "/comments", newComment, function() {
			var detail = new eventDetailView({model: that.model});
			$("#main").html(detail.render().el);
		});
	},

	deleteComment: function(e) {
		var index = $(e.currentTarget).data("index");

		var comments = this.model.get("comments") || [];
		comments.splice(index, 1);
		this.model.set("comments", comments);

		var urlRoot = this.model.urlRoot;
		var that = this;
		$.ajax({
			type: "delete",
			url: urlRoot + "/comments",
			data: {
				eventId: that.model.id,
				commentId: index
			},
			complete: function() {
				var detail = new eventDetailView({model: that.model});
				$("#main").html(detail.render().el);
			}
		});
	}
});