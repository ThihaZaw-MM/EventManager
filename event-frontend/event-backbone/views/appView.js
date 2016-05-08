var appView = Backbone.View.extend({
  el: "#app",
  
  initialize: function() {
    this.render();
  },
  
  render: function() {
    var nav = new navView();
    $("#nav").html( nav.render().el );

    app.verify(function() {
      app.eventList.fetch({
        success: function() {
          var list = new eventListView();
          $("#main").html( list.render().el );

          var nav = new navView();
          $("#nav").html( nav.render().el );

          app.userList.fetch();
          app.loadEventTypes();
          app.loadEventStatuses();
          app.loadUserRoles();
        }
      });
    }, function() {
      var login = new loginView();
      $("#main").html( login.render().el );
    });
  }
});