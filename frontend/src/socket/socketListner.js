import {
   replaceMessageWithDB,
   receiveMessage,
   updateMessageStatus,
   setUserTyping,
   clearUserTyping
} from '../features/chatSlice'
import { socket } from './socket'

const chatListener = (socket, dispatch, activeChat) => {
   // Listen for message created (replace temporary message with DB version)
   socket.on('msgCreated', (createdMsg) => {
      console.log('msgCreated:', createdMsg);
      dispatch(replaceMessageWithDB(createdMsg));
   });

   // Listen for incoming messages
   socket.on('reciveAMsg', (msg) => {
      console.log('reciveAMsg:', msg);
      dispatch(receiveMessage(msg));
   });

   // Listen for message status updates
   socket.on('msgStatusUpdate', (statusData) => {
      console.log('msgStatusUpdate:', statusData);
      dispatch(updateMessageStatus(statusData));
   });

   // Listen for typing indicators
   socket.on('typingStart', ({ senderId }) => {
      dispatch(setUserTyping({ [senderId]: true }));
   });

   socket.on('typingStop', ({ senderId }) => {
      dispatch(clearUserTyping());
   });
}

export default chatListener;