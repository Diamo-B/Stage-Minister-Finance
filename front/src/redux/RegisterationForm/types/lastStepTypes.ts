import { z } from "zod";
import { file } from "../../../Utils/interfaces/IFileUpload";

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
