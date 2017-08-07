var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

var mongoose = require('mongoose'),
    Campground = require('./models/campground.js'),
    Comment = require('./models/comment.js'),
    User = require('./models/user.js'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/index');

mongoose.connect(process.env.DATABASE_URL, {
  useMongoClient: true,
});
  
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//var seedDB = require('./seeds');

app.use(require('express-session')({
    secret: 'The Earth turns slowly.',
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});
        
app.use(authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Yelp camp has started!');
});