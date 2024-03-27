import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart : (state) => {
            state.loading = true;
        },
        signInSuccess : (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state, action) =>{
            state.error = action.payload;
            state.loading=false; 
        },
        updateUserStart : (state, action) =>{
            state.loading= true;
        },
        updateUserSuccess : (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure : (state, action) =>{
            state.error = action.payload;
            state.loading=false; 
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading=false; 
        },
        signoutUserStart: (state) => {
            state.loading = true;
        },
        signoutUserSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signoutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading=false; 
        }

    },
});

export const { signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess } = userSlice.actions;

export default userSlice.reducer;