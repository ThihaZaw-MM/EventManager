var userView = Backbone.View.extend({
  tagName: "tr",

  events: {
    "click .username": "viewProfile",
    "click .edit-user": "editUser",
    "click .delete-user": "deleteUser"
  },

  render: function() {
    var index = app.userList.indexOf(this.model);
    var roleIndex = this.model.toJSON().role;
    this.model.set("index", index + 1);
    this.model.set("roleLabel", app.userRole[roleIndex]);
    
    this.$el.html( app.hookTemplate("user", this.model.toJSON()) );
    return this;
  },

  viewProfile: function() {
    var profile = new userProfileView({ model: this.model });
    $("#main").html( profile.render().el );
  },

  editUser: function() {
    var user = new userEditView({ model: this.model });
    $("#main").html( user.render().el );
  },

  deleteUser: function() {
    this.model.destroy({
      wait: true,
      success: function() {
        var users = new userListView();
        $("#main").html( users.render().el );
      }
    });
  }
});

var userListView = Backbone.View.extend({
  tagName: "div",

  events: {
    "click #new-user": "newUser"
  },

  render: function() {
    this.$el.html( app.hookTemplate("user-list") );

    var that = this;
    app.userList.each(function(user) {
      var view = new userView({ model: user });
      $("tbody", that.$el).append( view.render().el );
    });

    return this;
  },

  newUser: function() {
    var view = new userNewView();
    $("#main").html( view.render().el );
  }
});