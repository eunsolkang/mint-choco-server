
// var express = require('express');
// var app     = express();
// var http    = require('http').Server(app);
// var io = require('socket.io')(http);
// var path    = require('path');
// http.listen(7727, function(){
//   console.log("server on!: http://localhost:3000/");
// });
// app.use(express.static(path.join(__dirname,"public")));

var io = require('socket.io')({
	transports: ['websocket'],
});
io.attach(3000);
var userList = [];



// var socket = io();
var lobbyManager = new (require('./LobbyManager.js'))(io);
var roomManager = new (require('./RoomManager.js'))(io);

io.on('connection', function(socket){
	console.log('영남이형');
	var nickname;
	socket.on('join', function(data){
		nickname = data;
		console.log(data);
		userList.push(nickname);
		socket.emit('join', nickname);
		console.log('userList : ', userList);
	});

	socket.on('pick', function(data){
		var tmp = data.pick;
		console.log(tmp);
		lobbyManager.push({socket, nickname, tmp});
		lobbyManager.dispatch(roomManager);
	});

	socket.on('userData', function(data){
		var roomNum = roomManager.roomIndex[socket.id];
		io.to(roomNum).emit('userData', data);
	});
	socket.on('gameLoad', function(){
		var roomNum = roomManager.roomIndex[socket.id];
		io.to(roomNum).emit('gameLoad', {ready : ++roomManager.rooms[roomNum].userCnt});
	});
	socket.on('move', function(data){
		var roomNum = roomManager.roomIndex[socket.id];
		socket.broadcast.to(roomNum).emit('move', data);
	});
	socket.on('bullet', function(data){
		var roomNum = roomManager.roomIndex[socket.id];
		io.to(roomNum).emit('bullet', {a : "a"});
	});
	socket.on('rotate', function(data){
		var roomNum = roomManager.roomIndex[socket.id];
		socket.broadcast.to(roomNum).emit('rotate', data);
	});

	socket.on('disconnect', function(){;
		var roomNum = roomManager.roomIndex[socket.id];
    if(roomNum){
      roomManager.destroy(roomNum, lobbyManager);
    }
		roomManager.rooms[roomNum].userCnt --;
    lobbyManager.kick(socket);
		lobbyManager.dispatch(roomManager);
    console.log('user disconnected: ', socket.id);
    //console.log(socket);
  });
});
