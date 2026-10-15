import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
import groupReducer from "../features/groupSlice"
import messageReducer from "../features/messageSlice"
import socketMiddleware from "./socketMiddleware";
import statusReducer from "../features/statusSlice"

const store = configureStore({
  reducer: {
    chat: chatReducer,
    group: groupReducer,
    message: messageReducer,
    status: statusReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)

});

export default store;
