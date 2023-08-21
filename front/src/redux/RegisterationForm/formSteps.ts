import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IformStepsState } from "./types/formStepsTypes";

export const formStepsState = createSlice({
    name: "formSteps",
    initialState: {
        current: 1,
        steps: [
            {
                order: 1,
                status: "pending",
            },
            {
                order: 2,
                content: "pending",
            },
            {
                order: 3,
                content: "pending",
            },
            {
                order: 4,
                content: "pending",
            },
            {
                order: 5,
                content: "pending",
            },
        ],
        submitState: false,
    } as IformStepsState,
    reducers: {
        changeStep: (state, action: PayloadAction<number>) => {
            state.current = action.payload;
        },
        incrementStep: state => {
            state.current += 1;
        },
        changeStepStatus: (
            state,
            action: PayloadAction<{
                order: number;
                status: "pending" | "done" | "error";
            }>,
        ) => {
            const { order, status } = action.payload;
            state.steps[order - 1].status = status;
        },
        resetSteps: state => {
            state.current = 1;
            state.steps = [
                {
                    order: 1,
                    status: "pending",
                },
                {
                    order: 2,
                    status: "pending",
                },
                {
                    order: 3,
                    status: "pending",
                },
                {
                    order: 4,
                    status: "pending",
                },
                {
                    order: 5,
                    status: "pending",
                },
            ];
        },
        enablesubmit: state => {
            state.submitState = true;
        },
        stopSubmit: state => {
            state.submitState = false;
        },
    },
});

export const {
    changeStep,
    incrementStep,
    changeStepStatus,
    resetSteps,
    enablesubmit,
    stopSubmit,
} = formStepsState.actions;
export default formStepsState.reducer;
