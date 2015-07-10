var mongoose = require('mongoose');

module.exports = mongoose.model('Device',{
    user_id: String,
    deviceid: String,
    subscribe: String,
    title: String,
    description: String,
    unit: String,
    field: String
});