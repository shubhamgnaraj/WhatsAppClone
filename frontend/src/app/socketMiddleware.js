import { socket } from "../socket/socket";

const socketMiddleware = (store) => {

  return (next) => (action) => {

    switch (action.type) {

      case 'socket/chatOpen':
        socket.emit("chatOpen", action.payload)
        return;

      case "socket/sendMessage":
        socket.emit("sendMessage", action.payload)
        return;


      case 'socket/msgsReadBatch':
        socket.emit("msgsReadBatch", action.payload)
        return;

      case 'socket/clearUnreadCount':
        socket.emit("clearUnreadCount", action.payload)
        return;


      case 'socket/startTyping':
        socket.emit("typingStart", action.payload)
        return;

      case 'socket/stopTyping':
        socket.emit("typingStop", action.payload)
    }
    return next(action)
  }
}

export default socketMiddleware;

