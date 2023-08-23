import Input from "../../../../FormElements/input";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { useEffect } from "react";
import useFormRegistry from "../../../../../hooks/candidat/Register/step1/useFormRegistry";
import IRegistrationForm from "../../../../../utils/interfaces/RegistrationForm/IRegistrationForm";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import {
    changeStep,
    changeStepStatus,
    stopSubmit,
} from "../../../../../redux/RegisterationForm/formSteps";
import Radios from "./Radios";

const Form = () => {
    const { RegisterCandidatSchema, handleUserData } = useFormRegistry();
    const dispatch = useAppDispatch();
    const { current, submitState } = useAppSelector(state => state.formSteps);

    const methods = useForm<IRegistrationForm>({
        resolver: zodResolver(RegisterCandidatSchema),
    });

    const submit: SubmitHandler<IRegistrationForm> = data => {
        handleUserData(data, methods.setError);
    };

    const triggerSubmit = methods.handleSubmit(submit);

    //explain: this sets the step number inside the localStorage
    useEffect(() => {
        const step = localStorage.getItem("step");
        if (step) {
            const stepNumber = parseInt(step);
            dispatch(changeStep(stepNumber));
        }
    }, []);

    //explain: This changes the steps overlays status to error or pending (steps colors)
    useEffect(() => {
        if (Object.keys(methods.formState.errors).length > 0) {
            dispatch(
                changeStepStatus({
                    order: current,
                    status: "error",
                }),
            );
        } else {
            dispatch(
                changeStepStatus({
                    order: current,
                    status: "pending",
                }),
            );
        }
    }, [methods.formState.errors]);

    //explain: this submits the form if the "suivant" button is clicked and the form is valid
    useEffect(() => {
        if (submitState) {
            triggerSubmit();
            dispatch(stopSubmit());
        }
    }, [submitState]);

    return (
        <FormProvider {...methods}>
            <form className="w-full" onSubmit={methods.handleSubmit(submit)}>
                <Radios />
                <div className="w-full grid grid-cols-2">
                    <Input
                        registerValue="prenom"
                        placeholder="Prénom"
                        t_left_text="Entrez votre prénom"
                    />
                    <Input
                        registerValue="nom"
                        placeholder="Nom"
                        t_left_text="Entrez votre nom"
                    />
                </div>
                <div className="w-full grid grid-cols-2">
                    <Input
                        registerValue="cin"
                        placeholder="CIN"
                        t_left_text="Entrez votre CIN"
                    />
                    <Input
                        registerValue="email"
                        placeholder="exemple@gmail.com"
                        t_left_text="Entrez votre email"
                    />
                </div>
                <div className="w-full grid grid-cols-2">
                    <Input
                        registerValue="password"
                        placeholder="mot de passe"
                        t_left_text="Entrez votre mot de passe"
                        type="password"
                    />
                    <Input
                        registerValue="conf"
                        placeholder="mot de passe"
                        t_left_text="Confirmer votre mot de passe"
                        type="password"
                    />
                </div>
                <div className="w-full grid grid-cols-2">
                    <Input
                        registerValue="tel"
                        placeholder="+212 6 00 00 00 00"
                        t_left_text="Entrez votre Numéro de téléphone"
                    />
                    <Input
                        registerValue="naissance"
                        placeholder="jj-mm-aaaa"
                        t_left_text="Entrez votre date de naissance"
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default Form;
