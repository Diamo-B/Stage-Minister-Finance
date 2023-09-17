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

export type result = {
    id: string;
    label: string;
    status:string;
    limitePlaces: number;
    direction:{
        label: string;
    };
    poste:{
        label: string;
    };
    grade:{
        label: string;
    };
    dateConcours: string;
    resultFilesPaths: {
        summonedCandidats: string;
        writtenExamResults: string;
        finalResults: string;
        accessPlan: string;
    }
}

export interface concoursState {
    concours: concours[];
    results: result[];
}