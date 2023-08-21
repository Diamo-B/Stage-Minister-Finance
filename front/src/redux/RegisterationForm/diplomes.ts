import { createSlice } from "@reduxjs/toolkit";
import { IDiplomesState, diplomeRecord } from "./types/diplomesTypes";

export const diplomesState = createSlice({
    name: "diplomes",
    initialState: {
        countries: [],
        universities: [],
        types: [],
        spécialités: [],
        filières: [],
        files: [],
        diplomes: [],
        NoFilesError: false,
    } as IDiplomesState,
    reducers: {
        setCountries: (state, action) => {
            state.countries = action.payload;
        },
        setUniversities: (state, action) => {
            state.universities = action.payload;
        },
        setTypes: (state, action) => {
            state.types = action.payload;
        },
        setSpécialités: (state, action) => {
            state.spécialités = action.payload;
        },
        setFilières: (state, action) => {
            state.filières = action.payload;
        },
        addFile: (state, action) => {
            state.files?.push(action.payload);
        },
        removeFile: (state, action) => {
            state.files?.splice(action.payload, 1); // remove file at index
        },
        resetFiles: state => {
            state.files = [];
        },
        setDiplomes: (state, action) => {
            state.diplomes = action.payload;
        },
        addDiplome: (state, action) => {
            state.diplomes?.push(action.payload);
        },
        removeDiplome: (state, action) => {
            //remove diplome with id matching action.payload
            state.diplomes?.splice(
                state.diplomes.findIndex(
                    (diplome: diplomeRecord) => diplome.id === action.payload,
                ),
                1,
            );
        },
        noFilesError: state => {
            state.NoFilesError = true;
        },
        noFilesErrorReset: state => {
            state.NoFilesError = false;
        },
    },
});

export const {
    setCountries,
    setUniversities,
    setFilières,
    setSpécialités,
    setTypes,
    addFile,
    removeFile,
    resetFiles,
    setDiplomes,
    addDiplome,
    removeDiplome,
    noFilesError,
    noFilesErrorReset,
} = diplomesState.actions;
export default diplomesState.reducer;
