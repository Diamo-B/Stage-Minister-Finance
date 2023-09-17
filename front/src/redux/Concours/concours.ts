import { createSlice } from '@reduxjs/toolkit'
import { concoursState } from './types/concours';


const concours = createSlice({
  name: 'concours',
  initialState:{
    concours: [],
    results: [],
  } as concoursState,
  reducers: {
    setConcours(state, action) {
      state.concours = action.payload
    },
    addCandidatsToConcours(state, action) {
      const { concoursId, candidat } = action.payload;
      state.concours.forEach(concours => {
        if (concours.id === concoursId) {
          if (concours.candidats) {
            concours.candidats.push(candidat);
          } else {
            concours.candidats = [candidat];
          }
        }
      });
    },
    setResults(state, action) {
      state.results = action.payload;
    }   
  }
});

export const {setConcours, addCandidatsToConcours, setResults} = concours.actions

export default concours.reducer