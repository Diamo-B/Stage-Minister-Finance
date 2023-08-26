import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";
import { UilCheck } from "@iconscout/react-unicons";
import useMailValidation from "../../../../../hooks/candidat/Register/step2/useMailValidation";
import { changeStepStatus } from "../../../../../redux/RegisterationForm/formSteps";
import { useState } from "react";
import useFormRegistry from "../../../../../hooks/login/forgotPassword/useFormRegistry";

type Props = {
    type: "registrationStep2" | "forgotPassword";
};

const SecondMail = ({type}:Props) => {
    const dispatch = useAppDispatch();
    const [animate, toggleAnimate] = useState<boolean>(false);
    const [clicked, toggleClick] = useState<boolean>(false);
    const { verificationResult } = useAppSelector(state => state.validation);
    const { email } = useAppSelector(state => state.forgotPassword);
    const { sendMail:sendRegistryMail } = useMailValidation();
    const { sendMail:sendForgotPasswordMail } = useFormRegistry();

    const triggerResendMail = async () => {
        if (type === "registrationStep2")
            dispatch(changeStepStatus({ order: 2, status: "pending" }));
        toggleClick(true);
        toggleAnimate(true);
        //explain: handle registration
        if (type === "registrationStep2")
            await sendRegistryMail()
                .catch((err: unknown) => console.error(err)) //TODO: handle error
                .finally(() => {
                    toggleAnimate(false);
                    setTimeout(() => {
                        toggleClick(false);
                    }, 3000);
                });
        //explain: handle forgot password
        else if (type === "forgotPassword" && email) 
        {
            sendForgotPasswordMail({
                emailOrCin: email,
            })
                .catch((err: unknown) => console.error(err)) //TODO: handle error
                .finally(() => {
                    toggleAnimate(false);
                    setTimeout(() => {
                        toggleClick(false);
                    }, 3000);
                });
        }
    };

    return (
        <div
            className={`flex justify-center items-center pt-5 font-bold text-slate-700`}
        >
            {!clicked ? (
                <div
                    className={`text-center ${
                        verificationResult === true
                            ? "hover:cursor-not-allowed text-slate-400"
                            : "hover:underline hover:cursor-pointer"
                    }`}
                    onClick={() => {
                        if (verificationResult !== true) triggerResendMail();
                    }}
                >
                    <p>N'avez-vous pas reçu notre email ?</p>
                    <p>
                        Cliquez ici, nous serons heureux de vous en envoyer un
                        autre.
                    </p>
                </div>
            ) : !animate ? (
                <div className="mt-5 text-center flex justify-center items-center gap-2">
                    <UilCheck className="text-success font-bold text-2xl" />
                    <p>Un autre email a été envoyé à votre adresse email</p>
                    <UilCheck className="text-success font-bold text-2xl" />
                </div>
            ) : (
                <span className="loading loading-spinner loading-lg text-secondary opacity-40"></span>
            )}
        </div>
    );
};

export default SecondMail;
