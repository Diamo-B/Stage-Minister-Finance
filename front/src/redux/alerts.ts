import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { alert, alertState } from "./types/alertsTypes";

export const alertSlice = createSlice({
    name: "alert",
    initialState: {
        alert: {
            status: false,
            message: "",
            level: undefined,
        },
    } as alertState,
    reducers: {
        activateAlert: (
            state,
            action: PayloadAction<Omit<alert, "status">>,
        ) => {
            state.alert.status = true;
            state.alert.message = action.payload.message;
            action.payload.level
                ? (state.alert.level = action.payload.level)
                : (state.alert.level = undefined);
        },
        disableAlert: state => {
            state.alert.status = false;
            state.alert.message = "";
            state.alert.level = undefined;
        },
    },
});

export const { activateAlert, disableAlert } = alertSlice.actions;
export default alertSlice.reducer;
