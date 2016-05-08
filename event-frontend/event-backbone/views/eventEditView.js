var eventEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #event-edit-form": "updateEvent",
    "click #close-edit": "showEventDetail"
  },

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("event-edit", this.model.toJSON()) );
    return this;
  },

  updateEvent: function() {
    var summaryInput = $("#summary");
    if(!summaryInput.val()) {
      summaryInput.parent().addClass('has-error');
      summaryInput.focus();
      return false;
    }

    var summary = summaryInput.val();
    var detail = $("#detail").html();

    var that = this;
    this.model.save({
      "detail" : detail,
      "summary" : summary
    }, {
      wait: true,
      success: function(res) {
        that.showEventDetail();
      }
    });

    return false;
  },

  showEventDetail: function(data) {
    var detail = new eventDetailView({ model: this.model });
    $("#main").html( detail.render().el );
  }
});