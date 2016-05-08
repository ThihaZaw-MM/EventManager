var userEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #edit-user-form": "updateUser"
  },

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("user-edit", this.model.toJSON()) );
    return this;
  },

  updateUser: function() {
    var fullName = $("#full-name").val();
    var loginId = $("#login-id").val();
    var email = $("#email").val();
    var role = $("#role").val();
    var password = $("#password").val();

    var err = 0;
    if(!fullName) {
      err++;
      $("#full-name").parent().addClass('has-error');
    }

    if(!loginId) {
      err++;
      $("#login-id").parent().addClass('has-error');
    }

    if(!email) {
      err++;
      $("#email").parent().addClass('has-error');
    }

    if(err) return false;

    var that = this;
    this.model.save({
      "fullName" : fullName,
      "loginId" : loginId,
      "email" : email,
      "role" : role,
      "roleLabel" : app.userRole[role],
      "password": password
    }, {
      wait: true,
      success: function() {
        that.showUserList();
      }
    });

    return false;
  },

  showUserList: function() {
    var list = new userListView();
    $("#main").html( list.render().el );
  }
});