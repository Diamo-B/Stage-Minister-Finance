import { createSlice } from "@reduxjs/toolkit";
import { ILastStep } from "./RegisterationForm/types/lastStepTypes";

const lastStep = createSlice({
    name: "lastStep",
    initialState: {
        CINFiles: [],
        attachmentsRecords: [],
        CVFiles: [],
    } as ILastStep,
    reducers: {
        //* Assigned files to the candidat
        setCINFiles: (state, action) => {
            state.CINFiles = action.payload;
        },
        addCINFile: (state, action) => {
            state.CINFiles?.push(action.payload);
        },
        removeCINFile: (state, action) => {
            state.CINFiles?.splice(action.payload, 1); //? remove file at index (action.payload)
        },
        resetCINFiles: state => {
            state.CINFiles = [];
        },
        setCVFiles: (state, action) => {
            state.CVFiles = action.payload;
        },
        addCVFile: (state, action) => {
            state.CVFiles?.push(action.payload);
        },
        removeCVFile: (state, action) => {
            state.CVFiles?.splice(action.payload, 1); //? remove file at index (action.payload)
        },
        resetCVFiles: state => {
            state.CVFiles = [];
        },
        //!----------------------------------------------------------------------------------------------------------
        //* showing the actual assigned files of the candidat
        setAttachmentRecords: (state, action) => {
            state.attachmentsRecords = action.payload;
        },
        addAttachmentRecord: (state, action) => {
            state.attachmentsRecords.push(action.payload);
        },
        removeAttachmentRecord: (state, action) => {
            state.attachmentsRecords.splice(action.payload, 1); //? remove file at index (action.payload)
        },
    },
});

export const {
    addCINFile,
    addCVFile,
    removeCINFile,
    removeCVFile,
    resetCINFiles,
    resetCVFiles,
    setCINFiles,
    setCVFiles,
    addAttachmentRecord,
    setAttachmentRecords,
    removeAttachmentRecord,
} = lastStep.actions;

export default lastStep.reducer;
