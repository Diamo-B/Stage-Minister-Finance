import { createSlice } from "@reduxjs/toolkit";
import { ManageConcoursState, concoursType } from "./types/manage";

const manage = createSlice({
    name: "concours_management",
    initialState: {
        switch: "campagnes",
        info: null,
        concours: [],
        filteredConcours: [],
    } as ManageConcoursState,
    reducers: {
        setConcours: (state, action) => {
            state.concours = action.payload;
        },
        deleteConcours: (state, action) => {
            state.concours = state.concours.filter(
                concours => concours.id !== action.payload,
            );
        },
        deleteMultipleConcours: (state, action) => {
            state.concours = state.concours.filter(
                concours => !action.payload.includes(concours.id),
            );
        },
        setSwitch: (state, action) => {
            state.switch = action.payload;
        },
        setInfo: (state, action) => {
            state.info = action.payload;
        },
        closeInfo: state => {
            state.info = null;
        },
        setFilteredConcours: (state, action) => {
            state.filteredConcours = action.payload;
        },
        deleteConcoursFromFiltered: (state, action) => {
            state.filteredConcours = state.filteredConcours.filter(
                concours => concours.id !== action.payload,
            );
        },
        deleteMultipleConcoursFromFiltered: (state, action) => {
            state.filteredConcours = state.filteredConcours.filter(
                concours => !action.payload.includes(concours.id),
            );
        },
        sortConcours: (state, action) => {
          function sortByLabel(arr:concoursType[], key: 'direction'|'poste'|'grade', order: 'asc' | 'desc') {
            return arr.sort((a, b) => {
                const labelA = a[key].label.toLowerCase();
                const labelB = b[key].label.toLowerCase();
        
                if (order === 'asc') {
                    return labelA.localeCompare(labelB);
                } else if (order === 'desc') {
                    return labelB.localeCompare(labelA);
                } else {
                    throw new Error('Invalid order parameter. Use "asc" or "desc".');
                }
            });
          }
          state.filteredConcours = sortByLabel(state.filteredConcours, action.payload.type, action.payload.order)
        }
    },
});

export const {
    setConcours,
    deleteConcours,
    deleteMultipleConcours,
    setSwitch,
    setInfo,
    closeInfo,
    deleteConcoursFromFiltered,
    deleteMultipleConcoursFromFiltered,
    setFilteredConcours,
    sortConcours
} = manage.actions;

export default manage.reducer;
