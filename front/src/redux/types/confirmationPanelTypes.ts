type functionParams = {
    id?: string;
    attachments?: { path: string }[];
    index?: number;
};

export interface IConfirmationPanel {
    show: boolean;
    text: string;
    itemIdentifier: string;
    functionParams: functionParams;
    isConfirmed: boolean;
}
