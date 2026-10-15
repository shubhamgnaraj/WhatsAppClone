import { createSlice } from "@reduxjs/toolkit";
import reducer from "./chatSlice";


const initialState = {
    replyMsg: {},
    messageOptExpandedId: null,
}

const messageSlice = createSlice({
    name: "msg",
    initialState,

    reducers: {
        addReplyMsgObj: (state, action) => {
            state.replyMsg = action.payload
        },
        removeReplyMsgInObj: (state) => {
            state.replyMsg = {}
        },
        addAndRemoveOptExpandedId: (state, action) => {
            state.messageOptExpandedId = state.messageOptExpandedId === action.payload ? null : action.payload
        },
    }
})

export const { addReplyMsgObj, removeReplyMsgInObj, addAndRemoveOptExpandedId } = messageSlice.actions;

export default messageSlice.reducer;
