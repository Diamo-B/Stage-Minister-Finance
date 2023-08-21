import { z } from "zod";
import { city } from "./detailsTypes";
import { file } from "../../../utils/interfaces/IFileUpload";

type country = {
    id: number;
    nom: string;
    code: string;
};

type university = {
    id: number;
    nom: string;
    adresse?: string;
    ville?: city | null;
};

type type = {
    id: number;
    nom: string;
};

type spécialité = {
    id: number;
    nom: string;
};

export type filière = {
    id: number;
    Filiere: string;
};

export type diplomeRecord = {
    id: string;
    nom: string;
    type: string;
    spécialité: string;
    filière: string;
    université: string;
    pays: string;
    annee: number;
    attachments: { path: string }[];
};

export const diplomeRecordValidation = z.array(
    z.object({
        id: z.string(),
        nom: z.string(),
        type: z.string(),
        spécialité: z.string(),
        filière: z.string(),
        université: z.string(),
        pays: z.string(),
        annee: z.number(),
        attachments: z.array(z.object({ path: z.string() })),
    }),
);

export interface IDiplomesState {
    countries: country[];
    universities: university[];
    types: type[];
    spécialités: spécialité[];
    filières: filière[];
    files: file[];
    diplomes: diplomeRecord[];
    NoFilesError: boolean;
}
