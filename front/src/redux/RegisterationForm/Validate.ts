import { createSlice } from "@reduxjs/toolkit";
import { IValidateState } from "./types/validationTypes";

export const validateSlice = createSlice({
    name: "validate",
    initialState: {
        count: 0,
        verificationResult: null,
        secondMailSend: {
            clicked: false,
            animate: false,
        },
        fieldsState: false,
    } as IValidateState,
    reducers: {
        verificationIdle: state => {
            state.verificationResult = null;
        },
        verificationSuccess: state => {
            state.verificationResult = true;
        },
        verificationFailure: state => {
            state.verificationResult = false;
        },
        toggleClick: state => {
            state.secondMailSend.clicked = !state.secondMailSend.clicked;
        },
        toggleAnimate: state => {
            state.secondMailSend.animate = !state.secondMailSend.animate;
        },
        disableFields: state => {
            state.fieldsState = true;
        },
        enableFields: state => {
            state.fieldsState = false;
        },
    },
});

export const {
    verificationIdle,
    verificationSuccess,
    verificationFailure,
    toggleClick,
    toggleAnimate,
    disableFields,
    enableFields,
} = validateSlice.actions;
export default validateSlice.reducer;
