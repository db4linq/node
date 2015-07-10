var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');
var Device = require('../models/device');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');
        //console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        //console.log('USER ID: ', id);
        var rows = [];
        /*var devices1 = [
            {_id: '111111111111', deviceid: '10038332', subscribe: '/10038332/temperature', field: 'Temperature', title: 'ชั้นล่าง-นอกบ้าน', unit: 'องศา C'},
            {_id: '222222222222', deviceid: '10070445', subscribe: '/10070445/temperature', field: 'Temperature', title: 'ชั้นล่าง-ในบ้าน', unit: 'องศา C'},
            {_id: '333333333333', deviceid: '10480777', subscribe: '/10480777/temperature', field: 'Temperature', title: 'ชั้นบน-ในบ้าน', unit: 'องศา C'}
        ];*/

        User.findById(id, function(err, user) {

            //console.log('deserializing user:',user);

            Device.find(function (err, devices) {
                if (err) {
                    console.error(err);
                    done(err, null);
                }else{
                    var dev = new Array();
                    var n = 1;
                    rows.push(dev);
                    for (i in devices){
                        if (n <= 3){
                            dev.push(devices[i]);
                            n++;
                        } else{

                            //console.log('Devices: ', dev);
                            n = 1;
                            //console.log('Add New Devices: ');
                            dev = new Array();
                            rows.push(dev);
                        }
                        //console.log('Device Loop: ', devices[i]);
                    }

                    user.devices = rows;
                    //console.log('Rows: ', rows);
                    done(null, user);
                }
            });

            //user.devices = rows;
            //done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

};