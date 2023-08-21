import { createSlice } from "@reduxjs/toolkit";
import { TcreateConcours } from "./types/create";

const createConcours = createSlice({
    name: "createConcours",
    initialState: {
        filteredCities: [],
        avis: [],
    } as TcreateConcours,
    reducers: {
        setFilteredCities: (state, action) => {
            state.filteredCities = action.payload;
        },
        resetFilteredCities: state => {
            state.filteredCities = [];
        },
        addAvis: (state, action) => {
            state.avis?.push(action.payload);
        },
        removeAvis: (state, action) => {
            state.avis?.splice(action.payload, 1); // remove file at index
        },
        resetAvis: state => {
            state.avis = [];
        },
    },
});

export const {
    resetFilteredCities,
    setFilteredCities,
    addAvis,
    removeAvis,
    resetAvis,
} = createConcours.actions;

export default createConcours.reducer;
