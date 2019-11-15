var express = require("express");
var router  = express.Router();
var Meetup = require("../models/meetup");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Meetup.find({}, function(err, allMeetups){
       if(err){
           console.log(err);
       } else {
          res.render("meetups/index",{meetups:allMeetups});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMeetup = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Meetup.create(newMeetup, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else 
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/meetups");
        })
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("meetups/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Meetup.findById(req.params.id).populate("comments").exec(function(err, foundMeetup){
        if(err){
            console.log(err);
        } else {
            console.log(foundMeetup)
            //render show template with that campground
            res.render("meetups/show", {meetup: foundMeetup});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkMeetupOwnership, function(req, res){
    Meetup.findById(req.params.id, function(err, foundMeetup){
        res.render("meetups/edit", {meetup: foundMeetup});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkMeetupOwnership, function(req, res){
    // find and update the correct campground
    Meetup.findByIdAndUpdate(req.params.id, req.body.meetup, function(err, updatedMeetup){
       if(err){
           res.redirect("/meetups");
       } else {
           //redirect somewhere(show page)
           res.redirect("/meetups/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkMeetupOwnership, function(req, res){
   Meetup.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/meetups");
      } else {
          res.redirect("/meetups");
      }
   });
});


module.exports = router;

