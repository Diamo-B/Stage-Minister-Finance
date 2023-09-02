import { createSlice } from '@reduxjs/toolkit'
import { GenValues } from './types/GeneralValuesTypes';


const GeneralValues = createSlice({
  name: 'genValues',
  initialState:{
    isDarkMode: false,
    connectedUser: null,
  } as GenValues,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setConnectedUser: (state, action) => {
      state.connectedUser = action.payload;
    }
  }
});

export const {toggleDarkMode, setConnectedUser} = GeneralValues.actions

export default GeneralValues.reducer