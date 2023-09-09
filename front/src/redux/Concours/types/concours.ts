export type concours = {
    id: string;
    label: string;
    limiteAge: number;
    limitePlaces: number;
    status: string;
    datePublication: string;
    dateLimiteInscription: string;
    dateConcours: string;
    campagneId: string; 
    avis: {path: string};
    candidats?: {id: string}[];  
}

export interface concoursState {
    concours: concours[];
}