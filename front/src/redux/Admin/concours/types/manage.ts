enum switchType {
    campagnes = 'campagnes',
    concours = 'concours'
}

export type concoursType = {
    id: string;
    label: string;
    direction: {
        id: string,
        label: string
    },
    poste: {
        id: string,
        label: string
    },
    grade: {
        id: string,
        label: string
    },
    specialite: {
        id: string,
        label: string
    },
    branche: {
        id: string,
        label: string
    },
    avis: {
        id: string,
        path: string,
        file?: File
    },
    candidats: {
        id: string,
        status: string,
        userId: string,
    }[],
    dateConcours: string,
    datePublication: string,
    dateLimiteInscription: string,
    limiteAge: string,
    limitePlaces: string,
    status: string
}

export interface ManageConcoursState {  
    switch : switchType;
    info : concoursType | null;
    concours : concoursType[];
    filteredConcours : concoursType[];
}   