import { createSlice } from "@reduxjs/toolkit";
import { ILoadingState } from "./types/loadingTypes";

export const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        loading: null,
        GenPageloading: false,
    } as ILoadingState,
    reducers: {
        startLoading: state => {
            state.loading = true;
        },
        stopLoading: state => {
            state.loading = false;
        },
        resetLoading: state => {
            state.loading = null;
        },
        startGenPageLoading: state => {
            state.GenPageloading = true;
        },
        stopGenPageLoading: state => {
            state.GenPageloading = false;
        },
    },
});

export const {
    startLoading,
    stopLoading,
    resetLoading,
    startGenPageLoading,
    stopGenPageLoading,
} = loadingSlice.actions;
export default loadingSlice.reducer;
