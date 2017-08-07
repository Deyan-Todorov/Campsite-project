var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {name: "Cloud's Rest",
     image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022_960_720.jpg",
     description: 'A lovely place to visit.'
    },
    {name: "Cloud's Rest",
     image: "https://cdn.pixabay.com/photo/2014/05/03/00/42/vw-camper-336606_960_720.jpg",
     description: 'A lovely place to visit.'
    },
    {name: "Cloud's Rest",
     image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/bricks-1846142_960_720.jpg",
     description: 'A lovely place to visit.'
    }];

function seedDB(){

Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else{
                console.log('added a campground');
                Comment.create({
                    text: 'This place is great and I wont complain because I am full of love',
                    author: 'Jessica'
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    } else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log('created new comment');
                    }
                });
            }
        });
    });
});

    
}

module.exports = seedDB();