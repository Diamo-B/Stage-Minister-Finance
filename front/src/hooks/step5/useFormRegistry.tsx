import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../redux";
import { IStep5Form } from "../../utils/interfaces/RegistrationForm/IStep5Form";
import { changeStepStatus } from "../../redux/RegisterationForm/formSteps";
import { startLoading, stopLoading } from "../../redux/loading";
import { setAttachmentRecords } from "../../redux/RegisterationForm/lastStep";
import { setHint } from "../../redux/RegisterationForm/formTabs";
import AddedAttachment from "../../utils/tours/RegistrationForm/attachments/AddedAttachment";

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
            formData.append("CVFiles", file.file); // Assuming 'file' is the field name expected by the backend
            formData.append("CVNames", file.name);
            formData.append("CVextensions", file.extension);
        });
        data.CIN?.forEach(file => {
            formData.append("CINFiles", file.file); // Assuming 'file' is the field name expected by the backend
            formData.append("CINNames", file.name);
            formData.append("CINextensions", file.extension);
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
