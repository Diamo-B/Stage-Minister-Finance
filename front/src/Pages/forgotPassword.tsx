import { Dispatch, MouseEvent, SetStateAction, useRef } from "react";
import Input from "../Components/FormElements/input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormRegistry from "../hooks/login/forgotPassword/useFormRegistry";
import { IForgotPassword } from "../utils/interfaces/Login/IForgotPassword";
import SecondMail from "../Components/Candidat/Registration/MultiStepForm/step2/secondMail";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { resetEmail } from "../redux/forgotPassword";
import { startLoading } from "../redux/loading";

type Props = {
    setForgotPassword: Dispatch<SetStateAction<boolean>>;
};
const ForgetPassword = ({ setForgotPassword }: Props) => {
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.loading);
    const cardRef = useRef<HTMLDivElement | null>(null);

    //explain: this removes the panel when the user clicks outside of it
    const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
        if (
            cardRef.current &&
            !cardRef.current.contains(event.target as HTMLDivElement)
        ) {
            dispatch(resetEmail());
            setForgotPassword(false);
        }
    };

    const { schema, sendMail } = useFormRegistry();

    const methods = useForm<IForgotPassword>({
        resolver: zodResolver(schema),
    });

    const {email} = useAppSelector(state => state.forgotPassword);
    function maskEmail(email:string|null) {
        if (!email) return "";
        const [username, domain] = email.split("@");

        let maskedUsername = "";
        if (username.length >= 3) {
            maskedUsername =
                username[0] + "*****" + username[username.length - 1];
        } else if (username.length === 2) {
            maskedUsername = username[0] + username[1] + "***";
        } else if (username.length === 1) {
            maskedUsername = username[0] + "***";
        }

        return `${maskedUsername}@${domain}`;
    }

    const submit = (data: IForgotPassword) => {
        dispatch(startLoading());
        sendMail(data)
    };

    return (
        <FormProvider {...methods}>
            <div
                className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-slate-700/75"
                onMouseDown={handleClickOutside}
            >
                <div
                    className="card w-4/12 bg-base-300 text-neutral"
                    ref={cardRef}
                    tabIndex={0}
                >
                    <form
                        className="card-body items-center text-center"
                        onSubmit={methods.handleSubmit(submit)}
                    >
                        <h2 className="card-title mb-5">
                            Récupération du mot de passe
                        </h2>
                        {email === null ? (
                            <>
                                <Input
                                    t_left_text="Email ou CIN"
                                    registerValue="emailOrCin"
                                    changeIndicatorPlacement
                                    customIndicatorStyle="border-2 border-neutral"
                                />
                                <div className="card-actions justify-end">
                                    <button type="submit" className="btn btn-wide min-h-32">
                                        {loading ? (
                                            <span className="loading loading-spinner loading-md"></span>
                                        ) : (
                                            "Envoyer l'email de récupération"
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold text-base-content">
                                    Un email a été envoyé a l'adresse `
                                    {maskEmail(email)}` avec succès
                                </h1>
                                <SecondMail type="forgotPassword" />
                            </>
                        )}
                    </form>
                </div>
            </div>
        </FormProvider>
    );
};

export default ForgetPassword;
