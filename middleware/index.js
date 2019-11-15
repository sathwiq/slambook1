var Meetup = require("../models/meetup");
var Comment = require("../models/comment");
var Feed = require("../models/feed");
// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkFeedOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Feed.findById(req.params.id, function(err, foundfeed){
           if(err){
               req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            //    console.log(foundfeed)
            if(foundfeed.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
middlewareObj.checkMeetupOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Meetup.findById(req.params.id, function(err, foundMeetup){
              if(err){
                  req.flash("error", "Campground not found");
                  res.redirect("back");
              }  else {
                  // does user own the campground?
               if(foundMeetup.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
   }
middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;