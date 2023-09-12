import { Dispatch, SetStateAction, useEffect } from "react";
import { startGenPageLoading, stopGenPageLoading } from "../../../../Redux/loading";
import { addAvis, resetAvis } from "../../../../Redux/Admin/concours/create";
import { useAppDispatch } from "../../../redux";
import { concoursType } from "../../../../Redux/Admin/concours/types/manage";
import { IConcours } from "../../../../Utils/interfaces/Admin/concours/IConcours";
import { UseFormSetValue } from "react-hook-form";
import { base64ToBlob } from "../../../../Utils/base64ToBlobs";

type Props = {
    isModify: concoursType | null;
    setIsModify: Dispatch<SetStateAction<concoursType | null>>;
    setValue: UseFormSetValue<IConcours>;
}

const useModification = ({isModify, setIsModify, setValue}: Props) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        //explain: In the case of a modification, fetch the 'avis' file's data from the database then set the formValues to the isModify values
        if (
            isModify?.avis.id !== undefined &&
            isModify?.avis.id !== null &&
            !isModify?.avis.file
        ) {
            dispatch(startGenPageLoading());
            fetch(
                `${
                    import.meta.env.VITE_BackendBaseUrl
                }/attachment/get/${isModify?.avis.id}/fileData`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "AccessToken",
                        )}`,
                    },
                },
            )
                .then(async res => {
                    const response = await res.json();
                    const fileName = isModify?.avis.path.replace("./public/Concours/", "").split("/")[1];
                    const fileExtension = fileName?.split(".")[1];
                    const base64Mime = `data:${fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`};base64,`;

                    const blob = base64ToBlob(response.attachmentFile, fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`)              
                    const f = new File([blob], fileName as string, {type: fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`})
                    const updatedAvis = { ...isModify.avis, file: f };
                    setIsModify({ ...isModify, avis: updatedAvis });
                    isModify.avis.file = f;
                    setValue(
                        "direction",
                        isModify?.direction.id,
                    );
                    setValue("poste", isModify?.poste.id);
                    setValue("grade", isModify?.grade.id);
                    setValue("branche", isModify?.branche.id);
                    setValue(
                        "spécialité",
                        isModify?.specialite.id,
                    );
                    setValue(
                        "maxPlaces",
                        //@ts-ignore
                        isModify?.limitePlaces.toString(),
                    );
                    setValue(
                        "maxAge",
                        //@ts-ignore
                        isModify?.limiteAge.toString(),
                    );
                    setValue(
                        "dateLimite",
                        isModify?.dateLimiteInscription,
                    );
                    setValue(
                        "dateConcours",
                        isModify?.dateConcours,
                    );
        
                    if (isModify.avis.file !== undefined) {                                  
                        dispatch(resetAvis());
                        dispatch(
                            addAvis({
                                file: base64Mime+response.attachmentFile,
                                name: fileName,
                                extension: fileExtension,
                            }),
                        );
                    }
                }).catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    dispatch(stopGenPageLoading());
                });
        }
    }, [isModify]);
}
 
export default useModification;