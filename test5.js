const io = require("socket.io-client");


let users = io.connect("http://localhost/users");
users.on('list',(data)=>{
    console.log(data);
});
/*chat.emit("connection");
chat.on("init",(data)=>{
    console.log(data);
    chat.emit("chatRestore","shernu");
    chat.on("msgArray",(data)=>{
     //   console.log(data);
    });
});

message = {
    sender : "shernu",
    reciever : "yedhu",
    message : "hello i am shernu",
    time : "time",
    isNewMsg : true,
    id : ""
};

chat.emit("SIDreg",message.sender);
chat.emit("message",message);

chat.on("success",(data)=>{
    console.log(data);
});

chat.on("err",(data)=>{
    console.log(data);
})

chat.on("messageIn",(data)=>{
    console.log(data);
});


let ioo = io.connect('http://localhost');
ioo.on("messageIn",(data)=>{
    console.log(data);
});
*/