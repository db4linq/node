var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var Log = mongoose.model('Log',{
    id: String,
    date_time: Date,
    data: {}
});

Log.find({id: '10038461'},  function (err, docs) {
    console.log(docs);
    console.log('***********************************************');
});

var q = Log.find({id: '10038461'}).sort({date_time: -1}).limit(10);
q.exec(function(err, docs) {
    console.log(docs.sort({date_time: 1}));
});