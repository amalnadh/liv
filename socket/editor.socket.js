var socketio = require('socket.io');
const connection = require("../database/index")

module.exports.editorSocket = (server)=>{

    io = socketio.listen(server); 

    io.of('/editor').on("connection",(socket) =>{
            _setSessionId(socket);
            _push(socket);
            _init(socket);
            _create(socket);
            _update(socket);
    });

}


const   _setSessionId = socket=>{
    socket.on("setSessionId",(username) =>{
        if(username != null){
            connection.db.collection("userData").then(collection => {
                var myquery = { username: username };
                var newvalues = { $set: {editorID : socket.id } };
                collection.update(myquery, newvalues).then(result=>{
                    console.log(result.updated.documents[0].editorID)
                })
            });                
        }        
    }); 
}

const _push = socket=>{
    socket.on('push',(data)=>{
        connection.db.collection("userData").then(collection => {
          collection.findOne( {"username" : data.reciever}).then(reciever=>{ 
              socket.to(reciever.editorID).emit('pull',data)
          })
        })
    })
}

const _create = socket=>{
    socket.on('editCreate',(data)=>{
        if(data){
            var i = 0;
            data.forEach(editorData => {
                var sender = editorData.sender;
                var reciever = editorData.reciever;
                var loc = editorData.loc
                connection.db.collection("edits").then(collection => {
                    collection.find( {
                    sender : sender,
                    reciever : reciever,
                    loc : loc
                    }).then(edits=>{
                        if(edits.length == 0){
                            edit = {};
                            edit.sender = editorData.sender;
                            edit.reciever = editorData.reciever;
                            edit.loc = editorData.loc;
                            edit.lastUpdatedTime = editorData.lastUpdatedTime;
                            edit.content = editorData.content;
                            connection.insertData(edit,'edits');
                        }
                    })    
                });
            })
        }
    })
}

const _init = socket=>{
    socket.on('editInit',(data)=>{
        connection.db.collection("edits").then(collection => {
          collection.find({
            reciever: data.username
          }).then(edits=>{ 
            socket.emit("editRestore",edits);
          });
        })
    })
}

const _update = socket=>{
    socket.on('editUpdate',(data)=>{
        if(data){
            if(data.loc != 0){
                connection.db.collection("edits").then(collection => {
                    collection.find( {
                    sender : data.sender,
                    loc : data.loc
                    }).then(edits=>{
                        if(edits != null){
                            var myquery = {
                            sender : data.sender,
                            loc : data.loc
                            };
                            var newvalues = { 
                            $set:{content : data.content } 
                            };
                            collection.update(myquery, newvalues).then(result=>{
                            console.log(result.updated.documents[0].message)
                            })         
                        }
                    })
                })
            }
        }
    })
}