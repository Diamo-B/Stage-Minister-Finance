import { z } from "zod";

export type file = {
    file: string;
    name: string;
    extension: string;
};

enum AttachmentType {
    CIN = "CIN",
    CV = "CV",
}

export type attachmentRecord = {
    id: string;
    path: string;
    type: AttachmentType;
};

export const attachmentRecordValidation = z.array(
    z.object({
        id: z.string().uuid(),
        path: z.string(),
        type: z.nativeEnum(AttachmentType),
    }),
);

export interface ILastStep {
    CINFiles: file[];
    attachmentsRecords: attachmentRecord[];
    CVFiles: file[];
}
