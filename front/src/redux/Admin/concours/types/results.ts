import { file } from "../../../../Utils/interfaces/IFileUpload";

export type TsetConcoursResults = {
    summonedCandidats: file[];
    writtenExamResults: file[];
    finalResults: file[];
    accessPlan: file[];
}