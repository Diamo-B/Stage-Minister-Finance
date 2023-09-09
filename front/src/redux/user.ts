import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "./types/userTypes";
export const userSlice = createSlice({
    name: "user",
    initialState: {
        titre: "",
        prenom: "",
        nom: "",
        cin: "",
        email: "",
        password: "",
        tel: "",
        naissance: "",
        mailSent: false,
    } as IUserState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<Omit<IUserState, "mailSent">>,
        ) => {
            state.titre = action.payload.titre;
            state.prenom = action.payload.prenom;
            state.nom = action.payload.nom;
            state.cin = action.payload.cin;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.tel = action.payload.tel;
            state.naissance = action.payload.naissance;
        },
        resetUser: state => {
            state.titre = "";
            state.prenom = "";
            state.nom = "";
            state.cin = "";
            state.email = "";
            state.password = "";
            state.tel = "";
            state.naissance = "";
            state.mailSent = false;
        },
        setUserDetails: (
            state,
            action: PayloadAction<
                Pick<IUserState, "adresse" | "ville" | "zip">
            >,
        ) => {
            state.adresse = action.payload.adresse;
            state.ville = action.payload.ville;
            state.zip = action.payload.zip;
        },
        mailSent: state => {
            state.mailSent = true;
        },
        mailNotSent: state => {
            state.mailSent = false;
        },
    },
});

export const { setUser, resetUser, setUserDetails, mailSent, mailNotSent } =
    userSlice.actions;
export default userSlice.reducer;
