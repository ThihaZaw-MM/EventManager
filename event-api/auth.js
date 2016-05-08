var mongojs = require("mongojs");
var crypto = require('crypto');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//Database for eventmanager
var db = mongojs('eventmanager', ['users','events']);

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Authentication strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    var pwdHash = crypto.createHash('sha1').update(password).digest("hex");

    db.users.findOne({loginId: username, password: pwdHash}, function(err, data) {
      if(data)
        return done(null, data);
      else
        return done(null, false);
    });
  }
));

exports.login = function() {
  return passport.authenticate("local");
}

exports.ensureAuth = function() {
  return function(req, res, next) {
    /*if(req.isAuthenticated())
      next()
    else res.sendStatus(401);*/
    next();
  }
}

exports.ensureSuper = function() {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 1)
      next();
    else
      res.sendStatus(401);
  }
};

exports.ensureRole = function(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role >= role)
      next();
    else
      res.sendStatus(401);
  }
};

exports.ensureOwner = function() {
  return function(req, res, next) {
    if (req.isAuthenticated() && (req.user._id == req.params.id || req.user.role === 1))
      next();
    else
      res.sendStatus(401);
  }
};

var isOrganizer = function(userId, data){
	var result = data.organizers.filter(function( obj ) {
	  return obj.userId == userId;
	});

	if (result.length == 0) {
	  return false;
	} else if (result.length == 1) {
	  return true;
	} else {
	  return true;
	}
};


exports.ensureOrganizer = function() {
  return function(req, res, next) {
    var iid = req.params.id;
    db.events.findOne({ _id: mongojs.ObjectId(iid) }, function(err, data) {
      if(err) {
        res.sendStatus(401);  
      } else {
        if (req.isAuthenticated() && (isOrganizer(req.user._id.str, data) || req.user.role === 1) )
          next();
        else
          res.sendStatus(401);
      }
    });
  }
};

