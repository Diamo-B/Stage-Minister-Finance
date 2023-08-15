export interface IDiplomeForm {
    intitule: string;
    etablissement: string;
    type: string;
    pays: string;
    annee: string;
    specialite: string;
    filiere: string;
    files: { name: string; extension: string; file: string }[];
}
