var express = require("express");
var router  = express.Router();
var Feed = require("../models/feed");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Feed.find({}, function(err, allFeed){
       if(err){
           console.log(err);
       } else {
          res.render("feeds/index",{feeds:allFeed});
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
    var newFeed = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Feed.create(newFeed, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else 
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/feeds");
        })
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("feeds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Feed.findById(req.params.id).populate("comments").exec(function(err, foundfeed){
        if(err){
            console.log(err);
        } else {
            console.log(foundfeed)
            //render show template with that campground
            res.render("feeds/show", {feed: foundfeed});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkFeedOwnership, function(req, res){
    Feed.findById(req.params.id, function(err, foundfeed){
        res.render("feeds/edit", {feed: foundfeed});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkFeedOwnership, function(req, res){
    // find and update the correct campground
    Feed.findByIdAndUpdate(req.params.id, req.body.feed, function(err, updatedMeetup){
       if(err){
           res.redirect("/feeds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/feeds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkFeedOwnership, function(req, res){
   Feed.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/feeds");
      } else {
          res.redirect("/feeds");
      }
   });
});


module.exports = router;

