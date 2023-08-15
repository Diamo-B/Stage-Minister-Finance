/*
 * This slice is used to control the tabs of the steps 4(diplomas) and 5(attachments) of the form
 */

import { createSlice } from "@reduxjs/toolkit";
import { ITabState } from "./RegisterationForm/types/formTabsTypes";

export const tabsSlice = createSlice({
    name: "tabs",
    initialState: {
        tab: 1,
        hint: 0,
    } as ITabState,
    reducers: {
        setTab: (state, action) => {
            state.tab = action.payload;
        },
        addHint: state => {
            state.hint += 1;
        },
        setHint: (state, action) => {
            state.hint = action.payload;
        },
        decrementHint: state => {
            state.hint -= 1;
        },
    },
});

export const { setTab, addHint, decrementHint, setHint } = tabsSlice.actions;
export default tabsSlice.reducer;
