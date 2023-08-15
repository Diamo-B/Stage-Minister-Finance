import { useAppSelector, useAppDispatch } from "../../../../hooks/redux";
import { UilCheck } from "@iconscout/react-unicons";
import useMailValidation from "../../../../hooks/step2/useMailValidation";
import { changeStepStatus } from "../../../../redux/RegisterationForm/formSteps";
import { useState } from "react";

const SecondMail = () => {
    const dispatch = useAppDispatch();
    const [animate, toggleAnimate] = useState<boolean>(false);
    const [clicked, toggleClick] = useState<boolean>(false);
    const { verificationResult } = useAppSelector(state => state.validation);
    const { sendMail } = useMailValidation();

    const triggerResendMail = async () => {
        dispatch(changeStepStatus({ order: 2, status: "pending" }));
        toggleClick(true);
        toggleAnimate(true);
        await sendMail()
            .catch((err: unknown) => console.error(err)) //TODO: handle error
            .finally(() => {
                toggleAnimate(false);
                setTimeout(() => {
                    toggleClick(false);
                }, 3000);
            });
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
