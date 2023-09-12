import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { z } from "zod";
import { IConcours } from "../../../../Utils/interfaces/Admin/concours/IConcours";
import { base64ToBlob } from "../../../../Utils/base64ToBlobs";
import { stopLoading } from "../../../../Redux/loading";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { UseFormClearErrors, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type ConcoursModificationOnlyProps = {
    clearErrors: UseFormClearErrors<IConcours>;
    setValue: UseFormSetValue<IConcours>;
    trigger: UseFormTrigger<IConcours>;
}

const useFormRegistry = () => {
    const schema = z
        .object({
            intitulé: z.string().nonempty(),
            direction: z.string().uuid().nonempty(),
            poste: z.string().uuid().nonempty(),
            grade: z.string().uuid().nonempty(),
            spécialité: z.string().uuid().nonempty(),
            branche: z.string().uuid().nonempty(),
            maxPlaces: z
                .string()
                .refine(
                    value => {
                        const parsedValue = parseInt(value);
                        return !isNaN(parsedValue);
                    },
                    { message: "La valeur doit être un nombre valide" },
                )
                .transform(value => parseInt(value)) // Convert the string to number
                .refine(value => value > 0, {
                    message: "Le nombre des places doit être positif",
                })
                .refine(value => value >= 1, {
                    message: "Vous devez au moins ajouter une seule place",
                }),
            maxAge: z
                .string()
                .refine(
                    value => {
                        const parsedValue = parseInt(value);
                        return !isNaN(parsedValue);
                    },
                    { message: "La valeur doit être un nombre valide" },
                )
                .transform(value => parseInt(value)) // Convert the string to number
                .refine(value => value > 0, {
                    message: "Le nombre des places doit être positif",
                })
                .refine(value => value >= 17 && value <= 50, {
                    message: "L'âge doit être entre 17 et 50 ans",
                }),
            dateLimite: z
                .string()
                .nonempty()
                .refine(
                    val => {
                        const dateLimite = dayjs(val, [
                            "DD-MM-YYYY",
                            "D-M-YYYY",
                        ]);
                        return dateLimite.isValid();
                    },
                    {
                        message: "Date non valide !!"
                    },
                )
                .refine(
                    val => {
                        const dateLimite = dayjs(val, [
                            "DD-MM-YYYY",
                            "D-M-YYYY",
                        ]);
                        const today = dayjs();
                        return (
                            dateLimite.isAfter(today) 
                        );
                    },
                    {
                        message:
                            "La date limite doit être après la date d'aujourd'hui",
                    },
                ),
            dateConcours: z
                .string()
                .nonempty()
                .refine(
                    val => {
                        const dateConcours = dayjs(val, [
                            "DD-MM-YYYY",
                            "D-M-YYYY",
                        ]);
                        return dateConcours.isValid();
                    },
                    {
                        message: "Date non valide !!",
                    },
                )
                .refine(
                    val => {
                        const dateLimite = dayjs(val, [
                            "DD-MM-YYYY",
                            "D-M-YYYY",
                        ]);
                        const today = dayjs();
                        return (
                            dateLimite.isAfter(today) 
                        );
                    },
                    {
                        message:
                            "La date limite doit être après la date d'aujourd'hui",
                    },
                ),
            avis: z
                .array(
                    z.object({
                        name: z.string().nonempty(),
                        extension: z.string().nonempty(),
                        file: z.string().nonempty(),
                    }),
                )
                .nonempty("Vous devez absolument ajouter un avis"),
            villes: z.array(z.string()),
        })
        .refine(
            data => {
                const dateLimite = dayjs(data.dateLimite, [
                    "DD-MM-YYYY",
                    "D-M-YYYY",
                ]);
                const dateConcours = dayjs(data.dateConcours, [
                    "DD-MM-YYYY",
                    "D-M-YYYY",
                ]);
                return dateLimite.isBefore(dateConcours);
            },
            {
                message: "La date limite doit être avant la date du concours",
                path: ["dateLimite"],
            },
        );

        //explain: This is used to trigger the validation of the form before submitting (when clicking the valider button)
        const { avis } = useAppSelector(state => state.concoursCreation);
    const triggerValidation = async (    
        {
        clearErrors,
        setValue,
        trigger
    }: ConcoursModificationOnlyProps) => {
        clearErrors();
        setValue("avis", avis);
        await trigger()
    };


        const dispatch = useAppDispatch();
        const navigate = useNavigate();
    const saveOrModifyConcours = (
        data: IConcours,
        type: "save" | "modify",
        emptyFields: () => void,
        id?: string,
    ) => {

        const file = data.avis[0];
        const base64Data = file.file.replace(/^data:.*;base64,/, ""); //explain: Remove data URL prefix for any type
        const contentType =
            file.extension === "pdf"
                ? "application/pdf"
                : `image/${file.extension}`;
        const blob = base64ToBlob(base64Data, contentType);

        const fd = new FormData();
        fd.append("label", data.intitulé);
        fd.append("directionId", data.direction);
        fd.append("posteId", data.poste);
        fd.append("gradeId", data.grade);
        fd.append("brancheId", data.branche);
        fd.append("specialiteId", data.spécialité);
        fd.append("maxPlaces", data.maxPlaces.toString());
        fd.append("maxAge", data.maxAge.toString());
        fd.append("dateLimiteDepot", data.dateLimite);
        fd.append("dateConcours", data.dateConcours);
        fd.append("villesIds", JSON.stringify(data.villes));
        fd.append("avis", blob, file.name);
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/concours/${type === 'save' ? 'create' : `update/${id}`}`,
            {
                method: `${type === 'save' ? 'POST' : 'PUT'}`,
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
                },
                body: fd,
            },
        )
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                if(type === 'save')
                    emptyFields(); // explain: only in create mode
                else
                {
                    //explain: in modify mode, return to the concours management page then display a message
                    navigate("/admin/concours",{state: {message: "Concours modifié avec succès", success: true}})  ;
                }
                dispatch(stopLoading());
            });
    }; 

    return { schema, triggerValidation, saveOrModifyConcours }; 
}; 

export default useFormRegistry;
