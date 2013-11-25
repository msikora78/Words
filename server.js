
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var application_root = __dirname;


var http = require('http');
var path = require('path');
var CONST = require('./const');

var app = express();

var port = 3000;


// all environments

app.configure( function() {

    app.set('port', process.env.PORT || port);
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/board', routes.board);


var io = require('socket.io').listen(app.listen(app.get('port')));

var gameWords = {};
var players = {};

io.sockets.on('connection', function (socket) {
    players[socket.id] = true;
    console.log('Players:', players);
    socket.on('send', function (data) {
        console.log('on send:', socket.id, data);
        io.sockets.emit('message', {
            word: data.word,
            owner: socket.id
        });
    });

    socket.on('disconnect', function() {
        console.log('on disconnect:', socket.id);
        delete players[socket.id];
        console.log('Players:', players);
    })
});

