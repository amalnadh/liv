const io = require("socket.io-client");
let chat = io.connect("http://localhost/chat");

chat.on("init",(data)=>{
    console.log(data);
  /*  chat.emit("chatRestore","yedhu");
    chat.on("msgArray",(data)=>{
 //      console.log(data);
    });*/
});
message = {
    sender : "yedhu",
    reciever : "shernu",
    message : "hello i am yedhu",
    time : "time",
    isNewMsg : true,
    id : "/chat#BajFgDKz9UZNvBVHAAAE"
};

chat.emit("SIDreg","yedhu");

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

 chat.on('disconnect', function(){
     console.log("socket disconnected");
 });