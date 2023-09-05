import { createSlice } from '@reduxjs/toolkit'
import { concoursState } from './types/concours';


const concours = createSlice({
  name: 'concours',
  initialState:{
    concours: [],
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
    }    
  }
});

export const {setConcours, addCandidatsToConcours} = concours.actions

export default concours.reducer