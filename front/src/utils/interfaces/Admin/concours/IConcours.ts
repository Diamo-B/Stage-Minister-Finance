import { file } from "../../IFileUpload";


export interface IConcours {
    intitulé: string;
    direction: string;
    poste: string;
    grade: string;
    spécialité: string;
    branche: string;
    maxPlaces: number;
    maxAge: number;
    dateLimite: string;
    dateConcours: string;
    avis: file[];
    villes: string[];
}