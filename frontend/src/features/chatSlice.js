import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  messages: [],
  groups: [],
  activeChat: "",
  userType: "",
  usersUnreadMsgCount: {},
  userTyping: {},

  showUserModel: false,
  showGroupModel: false
};

const chatAppSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    setUserType: (state, action) => {
      state.userType = action.payload
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
      state.messages = state.messages.map((msg) => {
        const isMatch =
          msg.senderId === createdMsg.senderId &&
          msg.reciverId === createdMsg.reciverId &&
          msg.content === createdMsg.content &&
          msg.chatType === createdMsg.chatType &&
          !msg._id;

        return isMatch ? createdMsg : msg;
      });
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

    userReadMessages: (state, action) => {
      const { batchIds, status } = action.payload

      state.messages = state.messages.map((msg) => {
        if (batchIds.includes(msg._id)) {
          return { ...msg, status: status }
        }
        return msg;
      })

    },

    showUserAddModel: (state) => {
      state.showUserModel = state.showUserModel ? false : true;
      
      if (state.showUserModel) {
        state.showGroupModel = false
      }

    },

    addUserIntheList: (state, action) => {
      state.users.push(action.payload)
    },

    showGroupCreateModel: (state) => {
      state.showGroupModel = state.showGroupModel ? false : true;

      if (state.showGroupModel) {
        state.showUserModel = false
      }
    }
  },
});

export const {
  setUsers,
  setActiveChat,
  setUserType,
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
  userReadMessages,
  showUserAddModel,
  addUserIntheList,
  showGroupCreateModel

} = chatAppSlice.actions;

export default chatAppSlice.reducer;
