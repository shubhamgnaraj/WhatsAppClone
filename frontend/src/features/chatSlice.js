import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  messages: [],
  activeChat: "",
  usersUnreadMsgCount: {},
  userTyping: {},
};

const chatAppSlice = createSlice({
  name: "chatApp",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    updateMessageStatus: (state, action) => {
      const { reciverId, status } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.reciverId === reciverId && msg.status !== "read"
          ? { ...msg, status }
          : msg
      );
    },

    replaceMessageWithDB: (state, action) => {
      const createdMsg = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.senderId === createdMsg.senderId &&
        msg.reciverId === createdMsg.reciverId &&
        msg.content === createdMsg.content &&
        msg.status === "sent" &&
        !msg._id
          ? createdMsg
          : msg
      );
    },

    setUnreadCount: (state, action) => {
      state.usersUnreadMsgCount = action.payload;
    },

    updateUnreadCount: (state, action) => {
      const { userId, count } = action.payload;
      state.usersUnreadMsgCount[userId] = count;
    },

    removeUnreadCount: (state, action) => {
      const userId = action.payload;
      delete state.usersUnreadMsgCount[userId];
    },

    setUserTyping: (state, action) => {
      state.userTyping = action.payload;
    },

    clearUserTyping: (state) => {
      state.userTyping = {};
    },

    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setUsers,
  setActiveChat,
  setMessages,
  addMessage,
  updateMessageStatus,
  replaceMessageWithDB,
  setUnreadCount,
  updateUnreadCount,
  removeUnreadCount,
  setUserTyping,
  clearUserTyping,
  receiveMessage,
  clearMessages,
} = chatAppSlice.actions;

export default chatAppSlice.reducer;
