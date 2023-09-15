import { z } from "zod";
import { ILoginForm } from "../../Utils/interfaces/Login/ILoginForm";
import { UseFormReset, UseFormSetFocus } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../../Redux/loading";
import { useAppDispatch } from "../redux";

const useFormRegistry = () => {
    const schema = z.object({
        email: z
            .string()
            .email({ message: "Adresse email invalide" })
            .nonempty(),
        password: z
            .string()
            .min(8, {
                message:
                    "Le mot de passe doit avoir un minimum de 8 caractères",
            })
            .nonempty(),
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const checkToken = () => {
        try {
            const token = localStorage.getItem("AccessToken");
            if (token) {
                fetch(
                    `${
                        import.meta.env.VITE_BackendBaseUrl
                    }/accounts/verifyToken`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                    .then(async res => {
                        const response = await res.json();
                        if (response.user.candidat?.id) {
                            navigate("/");
                        } else if (response.user.admin?.id) {
                            navigate("/admin");
                        }
                    })
                    .catch(async err => {
                        console.error(err);
                    });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const checkLogin = (
        data: ILoginForm,
        setLoginError: Dispatch<SetStateAction<string>>,
        reset: UseFormReset<ILoginForm>,
        focus: UseFormSetFocus<ILoginForm>,
    ) => {
        dispatch(startLoading());
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/accounts/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        })
            .then(async res => {
                const response = await res.json();
                if (response.token) {
                    localStorage.setItem("AccessToken", response.token);
                    setLoginError("");
                    //explain: redirect to the previous page if the user was redirected to the login page by another action
                    const redirectPath = location.state?.from;
                    if (redirectPath !== undefined) {
                        navigate(`${redirectPath}`,{state: {listOnly: true}});
                    } else if (response.type === "candidat") {
                        navigate("/");
                    } else if (response.type === "admin") {
                        navigate("/admin");
                    }
                } else {
                    if (response.status === 401) {
                        setLoginError(response.error);
                        focus("email", { shouldSelect: true });
                        reset({ password: "" });
                    }
                }
            })
            .catch(err => {
                console.error(err);
                setLoginError(
                    "Une erreur est survenue. Veuillez réessayer ultérieurement.",
                );
                reset();
            })
            .finally(() => {
                dispatch(stopLoading());
            });
    };

    return { schema, checkLogin, checkToken };
};

export default useFormRegistry;
