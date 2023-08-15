import { z } from "zod";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { IDiplomeForm } from "../../utils/interfaces/RegistrationForm/IDiplomeForm";
import { useAppDispatch } from "../redux";
import { addDiplome } from "../../redux/RegisterationForm/diplomes";
import { startLoading, stopLoading } from "../../redux/loading";
import { addHint } from "../../redux/RegisterationForm/formTabs";
import {
    setCountries,
    setFilières,
    setSpécialités,
    setTypes,
    setUniversities,
} from "../../redux/RegisterationForm/diplomes";
import { filière } from "../../redux/RegisterationForm/types/diplomesTypes";
import AddedDiploma from "../../utils/tours/RegistrationForm/diplomes/AddedDiplomaTour";

const useFormRegistry = () => {
    const dispatch = useAppDispatch();

    const schema = z
        .object({
            intitule: z
                .string()
                .nonempty({ message: "Intitulé du diplôme est obligatoire" }),
            etablissement: z
                .string()
                .uuid({ message: "Établissement est invalide" })
                .nonempty({ message: "Établissement est obligatoire" }),
            type: z
                .string()
                .uuid({ message: "Le type de diplôme est invalide" })
                .nonempty({ message: "Le type de diplôme est obligatoire" }),
            pays: z
                .string()
                .uuid({ message: "Le pays d'obtention est invalide" })
                .nonempty({ message: "Le pays d'obtention est obligatoire" }),
            annee: z
                .string()
                .nonempty({ message: "L'année d'obtention est obligatoire" })
                .refine(
                    value => {
                        const currentYear = dayjs().year();
                        const year = parseInt(value);
                        return year > 1950 && year <= currentYear;
                    },
                    { message: "L'année d'obtention est invalide" },
                ),
            specialite: z
                .string()
                .uuid({ message: "La spécialité est invalide" })
                .nonempty({ message: "La spécialité est obligatoire" }),
            filiere: z
                .string()
                .uuid({ message: "Filière est invalide" })
                .nonempty({ message: "Filière est obligatoire" }),
            files: z
                .array(
                    z.object({
                        name: z.string().nonempty(),
                        extension: z.string().nonempty(),
                        file: z.string().nonempty(),
                    }),
                )
                .nonempty({
                    message: "Vous devez sélectionner au moins un fichier",
                }),
        })
        .required()
        .strict();

    const FetchDataOnLoad = async () => {
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/api/v1/country/getAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async res => {
                const response = await res.json();
                dispatch(setCountries(response));
            })
            .catch(err => {
                console.error(err);
            });

        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/api/v1/university/getAll`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setUniversities(response));
            })
            .catch(err => {
                console.error(err);
            });

        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/diplome/getAll/types`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setTypes(response));
            })
            .catch(err => {
                console.error(err);
            });

        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/diplome/getAll/specs`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setSpécialités(response));
            })
            .catch(err => {
                console.error(err);
            });

        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/diplome/getAll/filieres`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                const filieres = response.map((obj: filière) => {
                    return {
                        id: obj.id,
                        nom: obj.Filiere,
                    };
                });
                dispatch(setFilières(filieres));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const FormSubmition = async (
        data: IDiplomeForm,
        shouldEmptyFiles: Dispatch<SetStateAction<boolean>>,
        resetErrors: () => void,
    ) => {
        dispatch(startLoading());
        // Create a new FormData object
        const formData = new FormData();
        formData.append("intitule", data.intitule);
        formData.append("etablissement", data.etablissement);
        formData.append("type", data.type);
        formData.append("pays", data.pays);
        formData.append("annee", data.annee);
        formData.append("specialite", data.specialite);
        formData.append("filiere", data.filiere);
        // Append each file object to the FormData
        data.files.forEach(file => {
            formData.append("files", file.file); // Assuming 'file' is the field name expected by the backend
            formData.append("name", file.name);
            formData.append("ext", file.extension);
        });

        await fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/api/v1/diplome/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(
                    addDiplome({
                        id: response.id,
                        nom: response.label,
                        type: response.type.nom,
                        spécialité: response.speciality.nom,
                        filière: response.affiliation.Filiere,
                        université: response.ecole.nom,
                        pays: response.paysObtention.nom,
                        annee: parseInt(response.anneeObtention),
                        attachments: response.attachments,
                    }),
                );
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                dispatch(stopLoading());
                shouldEmptyFiles(true);
                resetErrors();
                dispatch(addHint());
                AddedDiploma.setOption("dontShowAgain", true)
                    .setOption("dontShowAgainLabel", "Ne plus afficher")
                    .setOption("dontShowAgainCookie", "DiplomeTour")
                    .setOption("scrollToElement", true)
                    .start();
            });
    };

    return { schema, FetchDataOnLoad, FormSubmition };
};

export default useFormRegistry;
