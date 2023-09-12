import { file } from "../../../../Utils/interfaces/IFileUpload";

export type TCity = {
    id: string;
    nom: string;
    chefRegion?: boolean;
    region?: {
        id: number;
        nom: string;
    };
};

export type TcreateConcours = {
    filteredCities: TCity[];
    avis: file[];
};
