import { createSlice } from "@reduxjs/toolkit";
import { PostulerState } from "./types/postuler";

const PostulerSlice = createSlice({
    name: "Postuler",
    initialState: {
        show: false,
        concoursId: null,
        concoursTitle: null,
        showAlreadyApplied: false,
    } as PostulerState,
    reducers: {
        showPanel: state => {
            state.show = true;
        },
        showAlreadyAppliedPanel: state => {
            state.showAlreadyApplied = true;
        },
        setPanelData: (state, action) => {
            state.concoursId = action.payload.concoursId;
            state.concoursTitle = action.payload.concoursTitle;
        },
        hidePanel: state => {
            state.show = false;
        },
        hideAlreadyAppliedPanel: state => {
            state.showAlreadyApplied = false;
        },
        resetPanelData: state => {
            state.concoursId = null;
            state.concoursTitle = null;
        }
    },
});

export const {
    showPanel,
    showAlreadyAppliedPanel,
    setPanelData,
    hidePanel,
    hideAlreadyAppliedPanel,
    resetPanelData
} = PostulerSlice.actions;

export default PostulerSlice.reducer;
