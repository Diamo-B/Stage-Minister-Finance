import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { IStep5Form } from "../../../../utils/interfaces/RegistrationForm/IStep5Form";
import { changeStepStatus } from "../../../../redux/RegisterationForm/formSteps";
import { startLoading, stopLoading } from "../../../../redux/loading";
import { setAttachmentRecords } from "../../../../redux/RegisterationForm/lastStep";
import { setHint } from "../../../../redux/RegisterationForm/formTabs";
import AddedAttachment from "../../../../utils/tours/RegistrationForm/attachments/AddedAttachment";
import { base64ToBlob } from "../../../../utils/base64ToBlobs";

const useFormRegistry = () => {
    const schema = z.object({
        CIN: z
            .array(
                z.object({
                    name: z.string().nonempty(),
                    extension: z.string().nonempty(),
                    file: z.string().nonempty(),
                }),
            )
            .nonempty({
                message:
                    "Vous devez sélectionner au moins un fichier pour la carte d'identité nationale",
            }),
        CV: z
            .array(
                z.object({
                    name: z.string().nonempty(),
                    extension: z.string().nonempty(),
                    file: z.string().nonempty(),
                }),
            )
            .nonempty({
                message:
                    "Vous devez sélectionner au moins un fichier pour le CV",
            }),
    });

    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.formSteps);
    const handleAttachmentsLink = async (
        data: IStep5Form,
        emptyFields: () => void,
    ) => {
        dispatch(startLoading());
        const formData = new FormData();
        data.CV?.forEach(file => {
            const base64Data = file.file.replace(/^data:.*;base64,/, ""); //explain: Remove data URL prefix for any type
            const contentType =
                file.extension === "pdf"
                    ? "application/pdf" 
                    : `image/${file.extension}`;
            const blob = base64ToBlob(base64Data, contentType);
            formData.append("cvFiles", blob, file.name);
        });

        data.CIN?.forEach(file => {
            const base64Data = file.file.replace(/^data:.*;base64,/, ""); //explain: Remove data URL prefix for any type
            const contentType =
                file.extension === "pdf"
                    ? "application/pdf"
                    : `image/${file.extension}`;
            const blob = base64ToBlob(base64Data, contentType);
            formData.append("cinFiles", blob, file.name);
        });
        
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/api/v1/user/link/candidat/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setAttachmentRecords(response.Attachments));
                dispatch(setHint(response.Attachments.length));
                emptyFields();
                dispatch(changeStepStatus({ order: 5, status: "done" }));
            })
            .catch(async error => {
                const err = await error.json();
                console.error(err);
            })
            .finally(() => {
                dispatch(stopLoading());
                dispatch(changeStepStatus({ order: current, status: "done" }));
                AddedAttachment.setOption("dontShowAgain", true)
                    .setOption("dontShowAgainLabel", "Ne plus afficher")
                    .setOption("dontShowAgainCookie", "AttachmentsTour")
                    .setOption("scrollToElement", true)
                    .start();
            });
    };

    return { schema, handleAttachmentsLink };
};

export default useFormRegistry;
