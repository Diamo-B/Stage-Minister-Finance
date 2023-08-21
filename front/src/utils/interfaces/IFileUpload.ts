//explain: used as the type for the the redux reducer states for file upload all over the app (frontend validation  and the data sent to the backend api)
export interface file {
    file: string;
    name: string;
    extension: string;
}


//explain: used as the type for the files records inside the fileUploader component itself (to show the files that are being selected)
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
