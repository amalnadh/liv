const connection = require("../database/index")
const chat = require('./chat.socket');
const editor = require ('./editor.socket');
const sync = require('./sync.socket');
module.exports.listener = function(server) {
  chat.chatSocket(server);
  editor.editorSocket(server);
  sync.syncSocket(server);
}

