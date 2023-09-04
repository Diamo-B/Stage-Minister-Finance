import { createSlice } from '@reduxjs/toolkit'
import { PostulerState } from './types/postuler';

const PostulerSlice = createSlice({
  name: 'Postuler',
  initialState:{
    show: false,
    concoursId: null,
    concoursTitle: null,
  } as PostulerState,
  reducers: {
    showPostuler: (state, action) => {
        state.show = true
        state.concoursId = action.payload.concoursId
        state.concoursTitle = action.payload.concoursTitle
    },
    hidePostuler: (state) => {
        state.show = false
        state.concoursId = null
        state.concoursTitle = null
    }
  }
});

export const {showPostuler, hidePostuler} = PostulerSlice.actions

export default PostulerSlice.reducer