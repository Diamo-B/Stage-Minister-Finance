export interface IValidateState {
    verificationResult: boolean | null;
    secondMailSend: {
        clicked: boolean;
        animate: boolean;
    };
    fieldsState: boolean;
}
