var userNewView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #new-user-form": "create"
  },

  initialize: function() {
    this.listenTo(app.userList, 'add', this.showUserList);
  },

  render: function() {
    this.$el.html( app.hookTemplate("user-new") );
    return this;
  },

  create: function() {
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

    if(!password) {
      err++;
      $("#password").parent().addClass('has-error');
    }

    if(password != $("#password-again").val()) {
      err++;
      $("#password").parent().addClass('has-error');
      $("#password-again").parent().addClass('has-error');
    }

    if(err) return false;

    var model = new app.userModel({
      "fullName" : fullName,
      "loginId" : loginId,
      "email" : email,
      "role" : role,
      "password" : password
    });

    model.save(null, {
      wait: true,
      success: function(res) {
        app.userList.add(res);
      }
    });

    return false;
  },

  showUserList: function() {
    var list = new userListView();
    $("#main").html( list.render().el );
  }
});