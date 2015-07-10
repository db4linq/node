var express = require('express');
var router = express.Router();
var authen =  require('./authenticated');
Device = require('../models/device');

module.exports = function(passport){

    router.get('/new', authen.isAuthenticated, function(req, res, next){
        res.render('new_device', { title: 'New Device', user: req.user, device: null });
    });

    router.post('/new', authen.isAuthenticated, function(req, res, next){

        console.log('User ID: ', req.user._id);
        console.log('Device Id: ', req.body.device_id);
        console.log('Subscribe: ', req.body.subscribe);
        console.log('Title: ', req.body.title);
        console.log('Description: ', req.body.description);
        console.log('Unit: ', req.body.unit);
        console.log('Field: ', req.body.field);

        var newDevice = new Device();
        newDevice.user_id = req.user._id;
        newDevice.deviceid = req.body.device_id;
        newDevice.subscribe = req.body.subscribe;
        newDevice.title = req.body.title;
        newDevice.description = req.body.description;
        newDevice.unit = req.body.unit;
        newDevice.field = req.body.field;

        // save the device
        newDevice.save(function(err) {
            if (err){
                console.log('Error in Saving device: '+err);
                throw err;
            }
            console.log('Device Registration succesful');
            res.redirect('/');
        });
    });

    router.get('/delete/:id', authen.isAuthenticated, function(req, res, next){
        console.log('Delete Id: ', req.params.id);
        Device.remove({ _id: req.params.id }, function(err) {
            if (!err) {
                console.log('notification!');
            }
            else {
                console.log('error');
            }
        });
        res.redirect('/');
    });

    router.get('/edit/:id', authen.isAuthenticated, function(req, res, next){
        console.log('Delete Id: ', req.params.id);

        Device.findById(req.params.id, function(err, device) {
            res.render('update_device', { title: 'New Device', user: req.user, device: device });
        });

        //res.redirect('/');
    });

    router.post('/update', authen.isAuthenticated, function(req, res, next){

        console.log('User ID: ', req.user._id);
        console.log('Device Id: ', req.body.device_id);
        console.log('Subscribe: ', req.body.subscribe);
        console.log('Title: ', req.body.title);
        console.log('Description: ', req.body.description);
        console.log('Unit: ', req.body.unit);
        console.log('Field: ', req.body.field);

        Device.update({ _id: req.body._id },
            {
                deviceid: req.body.device_id,
                subscribe: req.body.subscribe,
                title: req.body.title,
                description: req.body.description,
                unit: req.body.unit,
                field: req.body.field
            },
            { multi: true }, function (err, numberAffected, raw) {

            if (err) return handleError(err);
            console.log('The number of updated documents was %d', numberAffected);
            console.log('The raw response from Mongo was ', raw);

            res.redirect('/');
        });

    });

    return router;
};
