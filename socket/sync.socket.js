var socketio = require("socket.io");
const connection = require("../database/index");

module.exports.syncSocket = (server) => {
  io = socketio.listen(server);

  io.of("/sync").on("connection", (socket) => {
    socket.emit("init", "connected");
    _setSocketId(socket);
    _message(socket);
    _edit(socket);
  });
};

const _setSocketId = (socket) => {
  socket.on("setSocketId", (userId) => {
    if (userId) {
      connection.db.collection("users").then((collection) => {
        var myquery = { id: userId };
        var newvalues = { $set: { socketId: socket.id } };
        collection.update(myquery, newvalues).then((result) => {});
      });
    }
  });
};

const _message = (socket) => {
  socket.on("message", (data) => {
    var { sender, receiver, content, channel } = data;
    if (channel) {
      connection.db.collection("projects").then((projectsCollection) => {
        projectsCollection
          .findOne({ id: receiver }, ["members"])
          .then((data) => {
            data.forEach((member) => {
              connection.db.collection("users").then((usersCollection) => {
                usersCollection.findOne({ id: member }).then((userData) => {
                  socket.to(userData.socketId).emit("messageReceived", data);
                  connection.insertData(data, "chats");
                });
              });
            });
          });
      });
    } else {
      connection.db.collection("users").then((collection) => {
        collection.findOne({ id: receiver }).then((userData) => {
          socket.to(userData.socketId).emit("messageReceived", data);
          connection.insertData(data, "chats");
        });
      });
    }
  });
};

const _edit = (socket) => {
  socket.on("edit", (data) => {
    var { sender, receiver, content, channel } = data;
    connection.db.collection("users").then((collection) => {
      collection.find({ id: receiver }).then((userData) => {
        socket.to(userData[0].socketId).emit("editReceived", data);
        connection.db.collection("editor").then((editorCollection) => {
          editorCollection.update(
            {
              $or: [
                {
                  sender: sender,
                  receiver: receiver,
                },

                {
                  receiver: sender,
                  sender: receiver,
                },
              ],
            },
            { code: content, channel: channel }
          );
        });
      });
    });
  });
};
