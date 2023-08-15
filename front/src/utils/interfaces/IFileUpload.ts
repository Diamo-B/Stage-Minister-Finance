export interface fileField {
    file: File;
}

export interface error {
    code: string;
    file: string;
    size: number;
    type: string;
}

export interface errorsField {
    sizeErrors: error[];
    numberError: boolean;
    typeErrors: error[];
    requiredError: boolean;
}
