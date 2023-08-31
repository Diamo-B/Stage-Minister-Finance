import { activateAlert } from "../../../../Redux/alerts";
import { decrementHint, setHint } from "../../../../Redux/RegisterationForm/formTabs";
import { removeAttachmentRecord } from "../../../../Redux/RegisterationForm/lastStep";
import { startLoading, stopLoading } from "../../../../Redux/loading";
import { useAppDispatch } from "../../../redux";
import { setAttachmentRecords } from "../../../../Redux/RegisterationForm/lastStep";
import { attachmentRecord } from "../../../../Redux/RegisterationForm/types/lastStepTypes";

const useHelpers = () => {
    const dispatch = useAppDispatch();

    const FetchOnLoadData = async () => {
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/attachment/getAll/candidat`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "RegistrationToken",
                    )}`,
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                const usefulRecords = response.filter(
                    (record: attachmentRecord) =>
                        record.type === "CIN" || record.type === "CV",
                );
                dispatch(setAttachmentRecords(usefulRecords));
                dispatch(setHint(usefulRecords.length));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const deleteAttachmentRecord = (id: string, index: number): void => {
        dispatch(startLoading());
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/attachment/delete/${id}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            },
        )
            .then(res => {
                if (res.ok) {
                    dispatch(removeAttachmentRecord(index));
                    dispatch(decrementHint());
                }
            })
            .catch(err => {
                console.error(err);
                dispatch(
                    activateAlert({
                        message:
                            "Une erreur s'est produite lors de la suppression de la pièce jointe",
                        level: "error",
                    }),
                );
            })
            .finally(() => dispatch(stopLoading()));
    };

    return { FetchOnLoadData, deleteAttachmentRecord };
};

export default useHelpers;
