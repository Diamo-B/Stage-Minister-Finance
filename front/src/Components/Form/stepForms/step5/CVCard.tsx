import { Dispatch, SetStateAction } from "react";
import FileUpload from "../../../fileUploader/fileUploader";

type Props = {
    emptyFilesCV: boolean;
    shouldEmptyFilesCV: Dispatch<SetStateAction<boolean>>;
};

const CVCard = ({ emptyFilesCV, shouldEmptyFilesCV }: Props) => {
    return (
        <div className="w-1/2 p-5 card flex-col items-center bg-base-300 rounded-box">
            <h2 className="card-title">CV</h2>
            <div className="card-body w-full">
                <FileUpload
                    emptyFiles={emptyFilesCV}
                    shouldEmptyFiles={shouldEmptyFilesCV}
                    reg="CV"
                    numberOfFiles={2}
                />
            </div>
        </div>
    );
};

export default CVCard;
