import { createSlice } from '@reduxjs/toolkit'
import { GenValues } from './types/GeneralValuesTypes';


const GeneralValues = createSlice({
  name: 'genValues',
  initialState:{
    isDarkMode: false,
    userType: 'visitor',
  } as GenValues,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    }
  }
});

export const {toggleDarkMode, setUserType} = GeneralValues.actions

export default GeneralValues.reducer