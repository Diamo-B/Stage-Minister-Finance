export type region = {
    id: number;
    nom: string;
};

export type city = {
    id: string;
    nom: string;
    chefRegion: boolean;
    regionId: number;
};

export interface detailsState {
    regions: region[];
    cities: city[];
    filtredCities: city[];
    selectedRegionId: number | null;
    selectedCityId: string | null;
}
