var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var User = require('../modules/user');
var flash= require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var server_errors = [];
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign up' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.get('/logout', function(req,res){
  req.logout();                                       //Passport: terminate a login session
  req.flash('success', 'You are now logged out');      //connect-flash
  res.redirect('/users/login');
});



router.post('/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: ' Invalid Username or Password'}),
 function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });

router.post('/signup',upload.single('avatar'), function(req, res, next) {
	
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var name = req.body.name;
    
	if(req.file){
      var profileimage = "/uploads/"+ req.file.filename;
      console.log(req.file);
    }else{
      var profileimage = '/uploads/noimage.jpg';
    }

    //express expressValidator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid ').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'password field is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);
    // check errors
	

		
    var errors = req.validationErrors();

    if(errors){
      res.render('signup', {errors: errors, server_errors:server_errors, title:'Sign up'})
	  
    }else{
      var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password,
        profileimage: profileimage
      });
	  

      User.createUser(newUser, function(err,user){
        if(err) throw err;
        console.log(user);
      });
      req.flash('success', 'You are now registered and can login in ');
      res.location('/');
      res.redirect('/');
    }
  });


passport.serializeUser(function(user,done){
  done(null, user.id);
});

passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
    done(err,user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if (err) throw err;
    if(!user){
      return done(null, false,{message:'Unkown User'});
    }
    User.comparePassword(password, user.password, function(err,isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      }else {
        return done(null, false, {message:'Invalid Passowrd'});
      }
    });
  });
}));

module.exports = router;
