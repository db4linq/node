var EventEmitter = require('events').EventEmitter;
var extend = require("xtend");
var mosca = require('mosca');
var settings = require('../settings.js');
var Log =  require('../models/log');

var MqttServer = function (options) {
    if (options) {
        this.options = extend(this.options, options);
    }

    EventEmitter.call(this);
    this.clients = {};
    this.server = null;
    this.socketio = null;
};

MqttServer.prototype = extend(EventEmitter.prototype, {


    start: function(io){
        this.socketio = io;
        var me = this;
        if (io){
            console.log('Register socket-io');
        }
        this.server = new mosca.Server(settings);
        this.server.on('clientConnected', function(client) {
            console.log('client connected', client.id);
        });

        // fired when a message is received
        this.server.on('published', function(packet, client) {
            var payload = packet.payload+'';
            var topic = packet.topic;

            console.log('Published: ', topic + ', ' + payload);
            console.log(topic.substr(0, 4));

            if ((topic.substr(0, 4) != '$SYS') && (topic.substr(0, 4) != '/lwt')){
                var newLog = new Log();
                newLog.id = client.id;
                newLog.data = JSON.parse(packet.payload+'');
                newLog.date_time = new Date();
                newLog.save(function(err) {
                    if (err){
                        console.log('Error in Saving device: '+err);
                        throw err;
                    }
                    console.log('Succesful: ', newLog);
                });
            }
            me.socketio.emit(packet.topic+'', packet.payload+'');
        });

        // fired when a client subscribes to a topic
        this.server.on('subscribed', function(topic, client) {
            console.log('subscribed : ', topic+'');
        });

        // fired when a client subscribes to a topic
        this.server.on('unsubscribed', function(topic, client) {
            console.log('unsubscribed : ', topic+'');
        });

        // fired when a client is disconnecting
        this.server.on('clientDisconnecting', function(client) {
            console.log('clientDisconnecting : ', client.id);
        });

        // fired when a client is disconnected
        this.server.on('clientDisconnected', function(client) {
            console.log('clientDisconnected : ', client.id);
        });

        this.server.on('ready', setup);

        // fired when the mqtt server is ready
        function setup() {
            console.log('Mosca server is up and running');
        }

        console.log('Starting MQTT Server Power By: NodeJS');
    },
    ready: function(){
        this.emit("ready");
    }
});

module.exports = MqttServer;
