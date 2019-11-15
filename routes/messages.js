var express = require("express");
var router  = express.Router();
var Message = require("../models/messages");
var middleware = require("../middleware");
var User = require("../models/user");
//   router.get('/', (req, res) => {
//     Message.find({},(err, messages)=> {
//       res.send(messages);
//     })
//   })
router.get("/:id",middleware.isLoggedIn, function(req, res){
    Message.find({ 'receiver.id' :{$in: [req.params.id,req.user._id]}  , 'sender.id': {$in: [req.params.id,req.user._id]} } ).exec(function(err, msgs){
        if(err){
            console.log(err);
        } else {
            
            console.log(msgs)
                    res.render("messages/message",{id : req.params.id,msgs:msgs});
                }
            })
        })
        

router.get("/",(req,res)=>{
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        } else {
           res.render("messages/all",{ allUsers:users});
        }
    });
})
  router.post('/',middleware.isLoggedIn ,(req, res) => {
    console.log(req.body)
    var message = req.body.message;
    var sender = {
        id: req.user._id,
        username: req.user.username
    }
    
    User.findById(req.body.name,(err,r)=>{
        if(err)
            console.log(err)

        console.log(r)
        var receiver = {
            id: r._id,
            username: r.username
        }
        var newMeetup = {message: message, sender : sender, receiver : receiver}
        Message.create(newMeetup, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else 
                //redirect back to campgrounds page
                console.log(newlyCreated);
                // io.emit('message', req.body);
            })
        })
    })
    // Message.save((err) =>{
    //     if(err)
    //       sendStatus(500);
    //     
    //     res.sendStatus(200);
//   })

  
module.exports = router;