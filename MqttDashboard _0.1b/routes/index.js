var express = require('express');
var router = express.Router();
var authen =  require('./authenticated');


module.exports = function(passport){
    router.get('/', authen.isAuthenticated, function(req, res, next) {
        res.render('index', { title: 'Dashboard', user: req.user, deviceid: '10038301' });
    });

    router.get('/register', function(req, res, next) {
        res.render('register', { title: 'Please sign up for MQTT Dashboard', message: req.flash('message') });
    });

    /* Handle Registration POST */
    router.post('/register', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash : true
    }));

    router.get('/login', function(req, res, next) {
        res.render('login');
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    return router;

};

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
