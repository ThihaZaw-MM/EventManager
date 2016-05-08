var navView = Backbone.View.extend({
  tagName: "div",
  className: "navbar navbar-default",

  events: {
    "click #new-event": "showNewEventForm",
    "click #event-list": "showEventList",
    "click #my-events": "showMyEvents",
    "click #user-list": "showUserList",
    "click #profile": "showProfile",
    "click #logout": "logout"
  },

  render: function() {
    var user = app.getUserInfo();
    if( user ) {
      /*var myEvents = app.eventList.where({ 
        organizers.userId: user._id 
      });*/
      var myEvents = app.eventList;

      var data = {
        auth: true,
        userName: user.fullName,
        eventCount: app.eventList.length,
        myEvents: myEvents.length
      };
    } else {
      data = {
        auth: false
      }
    }

    this.$el.html( app.hookTemplate("nav", data) );
    return this;
  },

  showNewEventForm: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var form = new eventNewView();
    $("#main").html( form.render().el );
  },

  showEventList: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var list = new eventListView();
    $("#main").html( list.render().el );
  },

  showMyEvents: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var list = new myEventListView();
    $("#main").html( list.render().el );
  },

  showUserList: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var users = new userListView();
    $("#main").html( users.render().el );
  },

  showProfile: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var user = new app.userModel(app.getUserInfo());
    var profile = new userProfileView({ model: user });
    $("#main").html( profile.render().el );
  },

  logout: function() {
    var that = this;
    app.logout(function() {
      var login = new loginView();
      $("#main").html( login.render().el );

      that.render();
    });   
  }
});