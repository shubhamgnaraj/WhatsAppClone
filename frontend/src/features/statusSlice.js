import { createSlice, current } from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: "status",
    initialState: {
        selectedUserStatuses: [],
        statusUsers: [],
        adminStatus: [],

        statusPreview: {},
        selectedUser: {},
        viewStatus: {},

        statusState: "",
        userIndex: 0,

    },

    reducers: {
        handleOnStatusPreview: (state, action) => {
            state.statusPreview = action.payload
        },

        pushNewAdminStatus: (state, action) => {
            if (action.payload.type === 'localState') {
                state.adminStatus = [...state.adminStatus, action.payload.newStatus]
            } else if (action.payload.type === 'responseState') {

                state.adminStatus = current(state.adminStatus).map((status) => {
                    if (status._id === action.payload.tempId) {
                        return action.payload.newStatus;
                    }
                    return status
                })
            }

        },

        handleViewUserStatus: (state, action) => {
            if (action.payload.type === "selectedUser") {

                state.selectedUser = action.payload.userStatusData
            } else state.selectedUser = {}
        },

        handleStatusUploaders: (state, action) => {
            state.statusUsers = action.payload
        },

        specificUserStatus: (state, action) => {
            if (action.payload.type === 'selectedUserStatuses') {
                state.selectedUserStatuses = action.payload.userStatuses;
            }
        },


    }
})

export const { handleOnStatusPreview, pushNewAdminStatus, handleViewUserStatus, specificUserStatus, handleStatusUploaders } = statusSlice.actions;

export default statusSlice.reducer;