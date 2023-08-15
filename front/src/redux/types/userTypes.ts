export interface IUserState {
    titre: string;
    prenom: string;
    nom: string;
    cin: string;
    email: string;
    password: string;
    tel: string;
    naissance: string;
    adresse?: string;
    ville?: {
        id: string;
        nom: string;
    };
    zip?: number;
    mailSent: boolean;
}
