import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import formStepsReducer from "./RegisterationForm/formSteps";
import validationReducer from "./RegisterationForm/Validate";
import detailsReducer from "./RegisterationForm/Details";
import diplomesState from "./RegisterationForm/diplomes";
import lastStepReducer from "./RegisterationForm/lastStep";
import formTabsReducer from "./RegisterationForm/formTabs";
import loadingReducer from "./loading";
import alertReducer from "./alerts";
import confirmationPanelReducer from "./confirmationPanel";
import concoursReducer from "./Admin/concours/create";


export const store = configureStore({
    reducer: {
        //----------------Applicant's Registration-------------------
        user: userReducer,
        formSteps: formStepsReducer,
        validation: validationReducer,
        details: detailsReducer,
        diplomes: diplomesState,
        lastStep: lastStepReducer,
        formTabs: formTabsReducer,
        //----------------create Concours-------------------
        concours: concoursReducer,
        //----------------General-------------------
        loading: loadingReducer,
        alert: alertReducer,
        confirmationPanel: confirmationPanelReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
