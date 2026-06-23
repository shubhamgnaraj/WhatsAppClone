import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    group: []
};

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        addGroups: (state, action) => {
            console.log('e')
        }
    }
})

const {addGroups} = groupSlice.actions;

export default groupSlice.reducer