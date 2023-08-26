import { createSlice } from "@reduxjs/toolkit";
import { IForgotPassword } from "./types/forgotPasswordTypes";

export const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState: {
        email: null,
    } as IForgotPassword,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        resetEmail: (state) => {
            state.email = null;
        }
    },
});

export const {
    setEmail,
    resetEmail,
} = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
