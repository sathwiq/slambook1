var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user")
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
//requiring routes
var commentRoutes    = require("./routes/comments"),
    meetupRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    messagesRoutes      = require("./routes/messages")
    mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost/yelp_camp_v10");
var promise=mongoose.connect("mongodb://localhost/slam",{useNewUrlParser: true});
promise.then(function(db) {
    console.log("Connected to database!!!");
}, function(err){
    console.log("Error in connecting database " + err);
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/meetups", meetupRoutes);
app.use("/meetups/:id/comments", commentRoutes);
app.use("/messages", messagesRoutes);
io.on('connection', () =>{
    console.log('a user is connected')
  })

// app.listen(3000, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
  });