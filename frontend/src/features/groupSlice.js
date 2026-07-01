import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    group: [],
    isGroupInfo: false
};

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        setIsGroupInfo: (state) => {
            state.isGroupInfo = !state.isGroupInfo
        }
    }
});

export const { setIsGroupInfo } = groupSlice.actions;

export default groupSlice.reducer;