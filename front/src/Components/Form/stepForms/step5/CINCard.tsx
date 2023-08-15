import { Dispatch, SetStateAction } from "react";
import FileUpload from "../../../fileUploader/fileUploader";

type Props = {
    emptyFilesCIN: boolean;
    shouldEmptyFilesCIN: Dispatch<SetStateAction<boolean>>;
};

const CINCard = ({ emptyFilesCIN, shouldEmptyFilesCIN }: Props) => {
    return (
        <div className="w-1/2 p-5 card flex-col items-center bg-base-300 rounded-box">
            <h2 className="card-title">Carte d'identité nationale</h2>
            <div className="card-body w-full">
                <FileUpload
                    emptyFiles={emptyFilesCIN}
                    shouldEmptyFiles={shouldEmptyFilesCIN}
                    reg="CIN"
                />
            </div>
        </div>
    );
};

export default CINCard;
