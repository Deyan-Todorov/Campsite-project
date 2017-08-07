//all the middleware goes here
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middlewareObj = {};

middlewareObj.isLoggenIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', "You need to be logged in to do that.");
    res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash('errror', 'Campground not found');
            console.log(err);
        } else{
            if(foundCampground.author.id.equals(req.user._id) || (req.user.isAdmin)){
            next();
            }
            else{
                req.flash('error', "You are not authorized to make changes to content you don't own.");
                res.redirect('back');
            }
        }
    });
   } else {
       res.redirect('back');
   }
    
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        } else{
            if(foundComment.author.id.equals(req.user._id) || (req.user.isAdmin)){
            next();
            }
            else{
                req.flash('error', "You are not authorized to make changes to content you don't oww.");
                res.redirect('back');
            }
        }
    });
   } else {
       res.redirect('back');
   }
    
};

middlewareObj.checkUser = function (req, res, next){
    if(req.isAuthenticated()){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash('errror', 'User not found');
            console.log(err);
        } else{
            if(foundUser._id.equals(req.user._id) || (req.user.isAdmin)){
            next();
            }
            else{
                req.flash('error', "You are not authorized to make changes to content you don't own.");
                res.redirect('back');
            }
        }
    });
   } else {
       res.redirect('/login');
   }
    
};

module.exports = middlewareObj;

