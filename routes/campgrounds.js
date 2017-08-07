var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var User = require('../models/user');
var middleware = require('../middleware');
var geocoder = require('geocoder');


router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
        
});

router.get('/new', middleware.isLoggenIn, function(req, res){
   res.render('campgrounds/new.ejs');
});

router.post('/', middleware.isLoggenIn, function(req, res){
  User.findById(req.user._id, function(err, user){
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            user.campgrounds.push(newlyCreated);
            user.save();
            res.redirect("/campgrounds");
        }
    });
  });
});
    
});

router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log('Error!');
            console.log(req.params.id);
            } else{
                    res.render('campgrounds/show', {campground: foundCampground});  
        }
    });
   
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render('campgrounds/edit', {campground: foundCampground});
    });
});
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            req.flash('error', "Campground deleted.");
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;