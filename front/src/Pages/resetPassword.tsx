import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UilExclamationOctagon, UilCheckCircle, UilArrowRight } from "@iconscout/react-unicons";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../Components/FormElements/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { startLoading, stopLoading } from "../Redux/loading";
import { useAppDispatch, useAppSelector } from "../Hooks/redux";
import AnimatedButton from "../Components/FormElements/animatedButton";

const ResetPassword = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.loading);
    const [expired, setExpired] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    interface IResetPassword {
        id: string;
        password: string;
        conf: string;
    }

    const schema = z
        .object({
            id: z.string().nonempty(),
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

    const methods = useForm<IResetPassword>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token")!;
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/accounts/password/verifyToken`,
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                if (response.status === 401) {
                    setExpired(true)
                    return;
                }else if (response.status === 403) {
                    setError(true);
                    return;
                } else if (response.id) {
                    methods.setValue("id", response.id);
                }
            })
            .catch(async err => {
                console.error(err);
                setError(true);
            });
    }, []);


    const submit = (data: IResetPassword) => {
        dispatch(startLoading())
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/accounts/password/reset`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: data.id,
                newPassword: data.password,
            }),
        })
            .then(async res => {
                const response = await res.json();
                if (response.userId) {
                    setSuccess(true);
                }
            })
            .catch(err => {
                console.error(err)
                setError(true)
            })
            .finally(() => {
                dispatch(stopLoading());
            });
    };
        

    return (
        <FormProvider {...methods}>
            <div className="h-screen w-full flex justify-center items-center">
                <div className="2xl:w-1/4 xl:w-2/4 border-2 rounded-2xl bg-base-100 text-base-content shadow-md my-auto py-10 text-center">
                    <h1 className="font-medium text-2xl mb-5">
                        Réinitialisation du mot de passe
                    </h1>
                    {!success ? (
                        expired || error ? (
                            <div className="flex flex-col justify-center items-center gap-2">
                                <UilExclamationOctagon className="w-20 h-20 text-red-500" />
                                <div>
                                    {expired && (
                                        <h1 className="font-medium text-xl">
                                            Le lien est expiré. Réessayer!
                                        </h1>
                                    )}
                                    {error && (
                                        <h1 className="font-medium text-xl">
                                            Une erreur inconnue est survenue.
                                            Réessayer!
                                        </h1>
                                    )}
                                    <Link className="link" to={"/login"}>
                                        <AnimatedButton
                                            customButtonClasses={["!btn-error","!text-white"]}
                                            Icon={() => (
                                                <UilArrowRight className="mx-auto w-10 h-10 text-white" />
                                            )}
                                            text="Retourner à la page de connexion"
                                        />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={methods.handleSubmit(submit)}>
                                <Input
                                    t_left_text="Nouvel mot de passe"
                                    changeIndicatorPlacement
                                    customIndicatorStyle="border-2 border-neutral"
                                    registerValue="password"
                                    type="password"
                                />
                                <Input
                                    t_left_text="confirmer le mot de passe"
                                    changeIndicatorPlacement
                                    customIndicatorStyle="border-2 border-neutral"
                                    registerValue="conf"
                                    type="password"
                                />
                                <button
                                    className="btn btn-wide mt-5"
                                    type="submit"
                                >
                                    {loading ? (
                                        <span className="loading loading-spinner loading-md"></span>
                                    ) : (
                                        "Réinitialiser le mot de passe"
                                    )}
                                </button>
                            </form>
                        )
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="flex justify-center">
                                <div className="w-3/4 flex flex-col justify-center items-center gap-2">
                                    <UilCheckCircle className="w-20 h-20 text-emerald-400" />
                                    <h1 className="font-medium text-xl text-center w-fit">
                                        Votre mot de passe a été réinitialisé
                                        avec succès.
                                    </h1>
                                </div>
                            </div>
                            <Link to={"/login"}>
                                <AnimatedButton
                                    customButtonClasses={["!text-neutral","hover:!btn-success"]}
                                    Icon={() => (
                                        <UilArrowRight className="mx-auto w-10 h-10 text-neutral group-hover:!text-white" />
                                    )}
                                    text="Retourner à la page de connexion"
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </FormProvider>
    );
};

export default ResetPassword;
