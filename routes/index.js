var express = require('express');
var router = express.Router();

router.get('/', auth, function(req, res, next) {
      res.render('index');
});

function auth(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
