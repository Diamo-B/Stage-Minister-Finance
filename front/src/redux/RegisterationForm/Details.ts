import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { city, detailsState, region } from "./types/detailsTypes";

export const detailsSlice = createSlice({
    name: "details",
    initialState: {
        regions: [],
        cities: [],
        filtredCities: [],
        selectedRegionId: null,
        selectedCityId: null,
    } as detailsState,
    reducers: {
        setRegions: (state, action: PayloadAction<region[]>) => {
            state.regions = action.payload;
        },
        setCities: (state, action: PayloadAction<city[]>) => {
            state.cities = action.payload;
        },
        selectRegionId: (state, action: PayloadAction<number>) => {
            state.selectedRegionId = action.payload;
        },
        resetRegionSelection: state => {
            state.selectedRegionId = null;
        },
        filterCities: state => {
            state.filtredCities = state.cities.filter(
                city => city.regionId == state.selectedRegionId,
            );
        },
        resetFilterCities: state => {
            state.filtredCities = [];
        },
        selectCityId: (state, action: PayloadAction<string>) => {
            state.selectedCityId = action.payload;
        },
    },
});

export const {
    setRegions,
    setCities,
    selectRegionId,
    resetRegionSelection,
    filterCities,
    resetFilterCities,
    selectCityId,
} = detailsSlice.actions;
export default detailsSlice.reducer;
