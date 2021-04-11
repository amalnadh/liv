var socketio = require("socket.io");
const connection = require("../database/index");

module.exports.chatSocket = (server) => {
  io = socketio.listen(server);
  io.of("/chat").on("connection", (socket) => {
    socket.emit("init", "chat connection initialized");
    _setSessionId(socket);
    _send(socket);
    _seen(socket);
    _typing(socket);
  });
};

const _send = (socket) => {
  socket.on("message", (message) => {
    console.log(socket.id);
    connection.db.collection("userData").then((collection) => {
      collection.findOne({ username: message.reciever }).then((reciever) => {
        var Message = {};
        Message.sender = message.sender;
        Message.reciever = message.reciever;
        Message.message = message.message;
        Message.isNewMsg = message.isNewMsg;
        Message.time = Date.now();
        connection.insertData(Message, "chats");
        socket.to(reciever.chatId).emit("messageIn", Message);
      });
    });
  });
};

const _seen = (socket) => {
  socket.on("messageSeen", (data) => {
    if (data != null) {
      connection.db.collection("chats").then((collection) => {
        collection
          .find({
            sender: data.sender,
            reciever: data.reciever,
            isNewMsg: true,
          })
          .then((msgs) => {
            msgs.forEach((msg) => {
              var myquery = {
                sender: data.sender,
                reciever: data.reciever,
                _id: msg._id,
              };
              var newvalues = {
                $set: { isNewMsg: false },
              };
              collection.update(myquery, newvalues).then((result) => {});
            });
          });
      });
    }
  });
};

const _typing = (socket) => {
  socket.on("typing", (data) => {
    connection.db.collection("userData").then((collection) => {
      collection.findOne({ username: data.reciever }).then((reciever) => {
        socket.to(reciever.chatId).emit("typing", data);
      });
      console.log(data);
    });
  });
};

const _setSessionId = (socket) => {
  socket.on("setSessionId", (username) => {
    if (username != null) {
      connection.db.collection("userData").then((collection) => {
        var myquery = { username: username };
        var newvalues = { $set: { chatId: socket.id } };
        collection.update(myquery, newvalues).then((result) => {
          console.log(result.updated.documents[0].chatId);
        });
      });
    }
  });
};
