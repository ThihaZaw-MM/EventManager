var eventListView = Backbone.View.extend({
  tagName: "div",

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("event-list") );

    var that = this;
    app.eventList.each(function(event) {
      var view = new eventView({ model: event });
      $("tbody", that.$el).append( view.render().el );
    });

    return this;
  }
});

var myEventListView = Backbone.View.extend({
  tagName: "div",

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("event-list") );

    var that = this;
    /*var events = app.eventList.where({ 
      assignedTo: app.getUserInfo()._id 
    });*/

    var events = app.eventList;

    _.each(events, function(event) {
      var view = new eventView({ model: event });
      $("tbody", that.$el).append( view.render().el );
    });

    return this;
  }
});

var eventView = Backbone.View.extend({
  tagName: "tr",

  events: {
    "click .event-eventName": "viewDetail"
  },

  initialize: function() {
    //
  },

  render: function() {
    var index = app.eventList.indexOf(this.model);
    this.model.set("index", index + 1); 
    this.$el.html( app.hookTemplate("event", this.model.toJSON() ) );
    return this;
  },

  viewDetail: function(e) {
    var detail = new eventDetailView({model: this.model});
    $("#main").html( detail.render().el );
  }
});