

function RoomManager(io){

  var RmMg = this;
  RmMg.rooms = [];
  RmMg.roomIndex = [];
  RmMg.create = function(data0,data1){
    var roomNum = data0.socket.id+data1.socket.id;
    var room = new Room(roomNum,data0,data1);
    data0.socket.join(roomNum);
    data1.socket.join(roomNum);
    io.to(roomNum).emit("pick", {a : "a"});
    RmMg.rooms[roomNum] = room;
    RmMg.roomIndex[data0.socket.id] = roomNum;
    RmMg.roomIndex[data1.socket.id] = roomNum;

    console.log("Room Created :", roomNum);
    // data0.socket.on('userData', function(data){
    //   io.to(roomNum).emit('userData', data);
    // });
    // data1.socket.on('userData', function(data){
    //   io.to(roomNum).emit('userData', data);
    // });
    // data0.socket.on('gameLoad', function(){
    //   io.to(roomNum).emit('gameLoad', {ready : ++userCnt});
    // });
    // data1.socket.on('gameLoad', function(){
    //   io.to(roomNum).emit('gameLoad', {ready : ++userCnt});
    // });
    // data0.socket.on('move', function(data){
    //   socket.broadcate.to(roomNum).emit('move', data);
    // });
    // data1.socket.on('move', function(data){
    //   socket.broadcate.to(roomNum).emit('move', data);
    // });
    // data0.socket.on('bullet', function(data){
    //   io.to(roomNum).emit('bullet', {a : "a"});
    // });
    // data1.socket.on('bullet', function(data){
    //   io.to(roomNum).emit('bullet', {a : "a"});
    // });
    // data0.socket.on('rotate', function(data){
    //   data0.socket.broadcate.to(roomNum).emit('rotate', data);
    // });
    // data1.socket.on('rotate', function(data){
    //   data0.socket.broadcate.to(roomNum).emit('rotate', data);
    // })
  };
  RmMg.destroy = function(roomNum, LbMg){
      var room = RmMg.rooms[roomNum];

      room.players.forEach(function(data){
        data.socket.emit('getout', {a : "a"});
        LbMg.push(data);
        delete RmMg.roomIndex[data.socket.id];
      });
      console.log(room);
      delete RmMg.rooms[roomNum];

  };
}

function Room(num, player0, player1)
{
  this.num = num;
  this.players = [player0, player1];
  this.userCnt = 0;
}

module.exports = RoomManager;
