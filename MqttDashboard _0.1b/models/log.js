var mongoose = require('mongoose');

module.exports = mongoose.model('Log',{
    id: String,
    date_time: Date,
    data: {}
});