import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
import groupReducer from "../features/groupSlice"

const store = configureStore({
  reducer: {
    chat: chatReducer,
    group: groupReducer
  },
});

export default store;
