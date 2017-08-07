var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    avatar: {type: String, default: 'http://www.pftec.com/wp-content/uploads/2015/03/default_user.png'},
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    introduction: String,
    campgrounds: [
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'Campground'
        }],
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);