import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { z } from "zod";
import IRegistrationForm from "../../utils/interfaces/RegistrationForm/IRegistrationForm";
import { UseFormSetError } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux";
import { setUser } from "../../redux/user";
import {
    changeStepStatus,
    incrementStep,
} from "../../redux/RegisterationForm/formSteps";

const useFormRegistry = () => {
    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.formSteps);

    enum TitreEnum {
        M = "M",
        Mme = "Mme",
        Mlle = "Mlle",
    }

    const RegisterCandidatSchema = z
        .object({
            titre: z.nativeEnum(TitreEnum, {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                errorMap: (issue, _ctx) => {
                    switch (issue.code) {
                        case "invalid_enum_value":
                            return { message: "le titre est invalide" };
                        default:
                            return {
                                message: "Erreur inconnue concernant le titre",
                            };
                    }
                },
            }),
            cin: z.string().min(6).nonempty(),
            prenom: z.string().nonempty(),
            nom: z.string().nonempty(),
            email: z.string().email().nonempty(),
            password: z
                .string()
                .min(
                    8,
                    "Les mots de passe doivent contenir au moins 8 caractères",
                ),
            conf: z
                .string()
                .min(
                    8,
                    "Les mots de passe doivent contenir au moins 8 caractères",
                ),
            tel: z
                .string()
                .nonempty()
                .refine(
                    val => {
                        const moroccanPhoneRegex = /^(0|\+212)\d{9}$/;
                        return moroccanPhoneRegex.test(val);
                    },
                    {
                        message: "Le numéro de téléphone n'est pas valide",
                    },
                ),
            naissance: z
                .string()
                .nonempty()
                .refine(
                    val => {
                        const birthDate = dayjs(val, "DD-MM-YYYY");
                        const isValid = birthDate.isValid();
                        const isAdult = dayjs().diff(birthDate, "year") >= 17;
                        return isValid && isAdult;
                    },
                    {
                        message:
                            "La date de naissance n'est pas valide pour un adulte",
                    },
                ),
        })
        .refine(
            data => {
                return data.password === data.conf;
            },
            {
                message: "Les mots de passe ne correspondent pas",
                path: ["conf"], // path of error
            },
        );

    const handleUserData = (
        data: IRegistrationForm,
        setError: UseFormSetError<IRegistrationForm>,
    ): void => {
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/api/v1/user/register/check`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cin: data.cin, email: data.email }),
            },
        )
            .then(async res => {
                const response = await res.json();
                if (res.status === 400) {
                    dispatch(
                        changeStepStatus({
                            order: current,
                            status: "error",
                        }),
                    );
                    if (response.email)
                        setError("email", {
                            type: "manual",
                            message: "Cet email est déjà associé à un compte",
                        });
                    if (response.cin)
                        setError("cin", {
                            type: "manual",
                            message: "Cet CIN est déjà associé à un compte",
                        });
                } else {
                    dispatch(setUser(data));
                    dispatch(
                        changeStepStatus({
                            order: 1,
                            status: "done",
                        }),
                    );
                    dispatch(incrementStep());
                }
            })
            .catch(err => {
                console.error(err);
                dispatch(
                    changeStepStatus({
                        order: current,
                        status: "error",
                    }),
                );
            });
    };

    return {
        RegisterCandidatSchema,
        handleUserData,
    };
};

export default useFormRegistry;
