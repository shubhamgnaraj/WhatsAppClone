import { socket } from "./socket";
import store from "../app/store";
import {
    clearUserTyping,
    receiveMessage,
    removeUnreadCount,
    replaceMessageWithDB,
    setUnreadCount,
    setUserTyping,
    updateUnreadCount,
    userReadMessages,
} from "../features/chatSlice";

const socketHandlers = {
    reciveAMsg: (messageData) => {
        store.dispatch(receiveMessage(messageData));
    },

    msgStatusUpdate: ({ batchIds, status}) => {
        if (batchIds) { 
            store.dispatch(userReadMessages({ batchIds, status }));
            return;
        }

        // if (reciverId) {
        //     store.dispatch(updateMessageStatus({ reciverId, status }));
        // }
    },

    unreadMsgesCount: (countData) => {
        store.dispatch(setUnreadCount(countData || {}));
    },

    notificationMsg: ({ senderId, unreadCount }) => {

        store.dispatch(updateUnreadCount({ userId: senderId, count: unreadCount }));
    },

    removeUnreadCount: ({ userId }) => {
        store.dispatch(removeUnreadCount(userId));
    },

    msgCreated: (createdMsg) => {
        store.dispatch(replaceMessageWithDB(createdMsg));
    },

    typingStarted: (data) => {
        store.dispatch(setUserTyping({ senderId: data.senderId, typing: "Typing..." }));
    },

    typingStop: ({ senderId }) => {
        store.dispatch(clearUserTyping());
    },

    errorOccured: (error) => {
        console.error("Socket error:", error);
    },
};

let isListenerRegistered = false;

export const socketListner = () => {
    if (isListenerRegistered) return () => cleanupSocketListner();

    Object.entries(socketHandlers).forEach(([eventName, handler]) => {
        socket.on(eventName, handler);
    });

    isListenerRegistered = true;

    return () => cleanupSocketListner();
};

export function cleanupSocketListner() {
    if (!isListenerRegistered) return;

    Object.entries(socketHandlers).forEach(([eventName, handler]) => {
        socket.off(eventName, handler);
    });

    isListenerRegistered = false;
};

export default socketListner;
