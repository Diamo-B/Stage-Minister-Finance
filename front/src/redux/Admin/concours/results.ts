import { createSlice } from '@reduxjs/toolkit'
import { TsetConcoursResults } from './types/results';

const setConcoursResults = createSlice({
  name: "setConcoursResults",
  initialState:{
    summonedCandidats: [],
    writtenExamResults:[],
    finalResults:[],
    accessPlan:[]
  } as TsetConcoursResults,
  reducers: {
    addSummonedCandidats: (state, action) => {
        state.summonedCandidats?.push(action.payload);
    },
    removeSummonedCandidats: (state, action) => {
        state.summonedCandidats?.splice(action.payload, 1); // remove file at index
    },
    resetSummonedCandidats: state => {
        state.summonedCandidats = [];
    },

    addWrittenExamResults: (state, action) => {
        state.writtenExamResults?.push(action.payload);
    },
    removeWrittenExamResults: (state, action) => {
        state.writtenExamResults?.splice(action.payload, 1); // remove file at index
    },
    resetWrittenExamResults: state => {
        state.writtenExamResults = [];
    },

    addFinalResults: (state, action) => {
        state.finalResults?.push(action.payload);
    },
    removeFinalResults: (state, action) => {
        state.finalResults?.splice(action.payload, 1); // remove file at index
    },
    resetFinalResults: state => {
        state.finalResults = [];
    },

    addAccessPlan: (state, action) => {
        state.accessPlan?.push(action.payload);
    },
    removeAccessPlan: (state, action) => {
        state.accessPlan?.splice(action.payload, 1); // remove file at index
    },
    resetAccessPlan: state => {
        state.accessPlan = [];
    },
  }
});

export const {
    addAccessPlan,
    addFinalResults,
    addSummonedCandidats,
    addWrittenExamResults,
    removeAccessPlan,
    removeFinalResults,
    removeSummonedCandidats,
    removeWrittenExamResults,
    resetAccessPlan,
    resetFinalResults,
    resetSummonedCandidats,
    resetWrittenExamResults
} = setConcoursResults.actions

export default setConcoursResults.reducer