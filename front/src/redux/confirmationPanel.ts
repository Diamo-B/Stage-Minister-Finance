import { createSlice } from "@reduxjs/toolkit";
import { IConfirmationPanel } from "./types/confirmationPanelTypes";

const confirmationPanel = createSlice({
    name: "confirmationPanel",
    initialState: {
        show: false,
        text: "",
        itemIdentifier: "",
        functionParams: {},
        isConfirmed: false,
    } as IConfirmationPanel,
    reducers: {
        showConfirmationPanel: (state, action) => {
            state.show = true;
            state.text = action.payload.text;
            state.itemIdentifier = action.payload.itemIdentifier;
            state.functionParams = action.payload.functionParams;
        },
        hideConfirmationPanel: state => {
            state.show = false;
            state.text = "";
            state.itemIdentifier = "";
            state.functionParams = {};
            state.isConfirmed = false;
        },
        setIsConfirmed: state => {
            state.isConfirmed = true;
        }
    },
});

export const { hideConfirmationPanel, showConfirmationPanel, setIsConfirmed } =
    confirmationPanel.actions;

export default confirmationPanel.reducer;
