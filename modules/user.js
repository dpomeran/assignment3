var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
config = require('../config.js');
mongoose.connect(databaseString,{useNewUrlParser:true});

var UserSchema = mongoose.Schema({
  username:{type: String},
  password:{type: String},
  email:{type: String},
  name:{type: String },
  profileimage:{type: String},
  forgetpassword: Boolean
  });

var User = module.exports = mongoose.model('User', UserSchema)
module.exports.getUserById=function(id,callback){
  User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
  var query = {username:username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(canidatePassword, hash, callback){
  bcrypt.compare(canidatePassword, hash, function(err, res) {
      callback(null,res);
  });
};


module.exports.createUser = function(newUser, callback){
    bcrypt.hash(newUser.password, null, null, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
};
