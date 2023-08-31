import Input from "./input";
import { useAppDispatch, useAppSelector } from "../../../../../Hooks/redux";
import { createRef, useEffect, useState } from "react";
import {
    verificationFailure,
    verificationIdle,
    verificationSuccess,
    disableFields,
    enableFields,
} from "../../../../../Redux/RegisterationForm/Validate";
import { startLoading, stopLoading } from "../../../../../Redux/loading";
import { mailSent } from "../../../../../Redux/user";
import useMailValidation from "../../../../../Hooks/candidat/Register/step2/useMailValidation";
import useCodeEntry from "../../../../../Hooks/candidat/Register/step2/useCodeEntry";
import mailErrorTour from "../../../../../Utils/tours/RegistrationForm/emails/errorTour";
import mailSuccessTour from "../../../../../Utils/tours/RegistrationForm/emails/successTour";
import {
    changeStepStatus,
    incrementStep,
    stopSubmit,
} from "../../../../../Redux/RegisterationForm/formSteps";

export type InputRef = {
    ref: React.RefObject<HTMLInputElement>;
    isFilled: boolean;
};

//explain: create ref for each 'Input' component
const inputRefs: InputRef[] = Array.from({ length: 6 }).map(() => ({
    ref: createRef<HTMLInputElement>(),
    isFilled: false,
}));

const Validate = () => {
    const dispatch = useAppDispatch();
    const { email } = useAppSelector(state => state.user);
    const { verificationResult, fieldsState } = useAppSelector(
        state => state.validation,
    );
    const { loading } = useAppSelector(state => state.loading);
    const { submitState } = useAppSelector(state => state.formSteps);
    const user = useAppSelector(state => state.user);
    const [count, setCount] = useState<number>(0);
    const [clearFields, setClearFields] = useState<boolean>(false);

    const { handleInputChange, handleKeyDown } = useCodeEntry({
        inputRefs,
        setCount,
    });
    const { checkCode, sendMail, saveUserInDB } = useMailValidation();

    useEffect(() => {
        dispatch(stopLoading());
    }, []);

    //explain: Sends the verification mail when the user reaches the second step (verification page)
    useEffect(() => {
        const execute = async () => {
            await sendMail()
                .catch(err => console.error(err)) //TODO: handle error
                .finally(() => {
                    dispatch(mailSent()); //? sets a state of mailSent to true to prevent sending additional mails
                });
        };

        if (user.mailSent == false && Object.values(user).join("") != "") {
            execute();
        }
    }, [user]);

    //explain: Checks the code when the user has entered all the fields
    useEffect(() => {
        const execute = async () => {
            if (count == 6 && !loading) {
                dispatch(startLoading());
                dispatch(disableFields());

                const code = inputRefs
                    .map(input => input.ref.current?.value)
                    .join("");

                const result = await checkCode(code);
                if (result) {
                    //explain: code is correct
                    dispatch(verificationSuccess());
                    saveUserInDB();
                    setTimeout(() => {
                        dispatch(stopLoading());
                        mailSuccessTour.start();
                        dispatch(
                            changeStepStatus({
                                order: 2,
                                status: "done",
                            }),
                        );
                    }, 2000);
                } else {
                    //explain: code is incorrect
                    dispatch(verificationFailure());
                    setTimeout(() => {
                        dispatch(stopLoading());
                        dispatch(
                            changeStepStatus({
                                order: 2,
                                status: "error",
                            }),
                        );
                        mailErrorTour
                            .onexit(() => {
                                setClearFields(true);
                                dispatch(enableFields());
                                setCount(0);
                                dispatch(verificationIdle());
                                setTimeout(() => {
                                    inputRefs[0].ref.current?.focus();
                                }, 0);
                            })
                            .start();
                    }, 2000);
                }
            }
        };
        execute();
    }, [count]);

    //explain: when the user has entered a wrong code and the error tour has finished (look line 97), the fields are cleared using the clearFields state, now this useEffect returns that state to false so that the inputs stop deleting the numbers and the user can type another code
    useEffect(() => {
        verificationResult === null && setClearFields(false);
    }, [verificationResult]);

    //explain: when the user has entered a correct code and clicked on the next button (suivant), the form step is incremented and the submitState is set to false so that the user can continue to the next step
    useEffect(() => {
        if (submitState && verificationResult === true) {
            dispatch(incrementStep());
            mailSuccessTour.exit();
            dispatch(stopSubmit());
        }
    }, [submitState]);

    return (
        <div className="w-3/4 p-10 bg-base-200 rounded-2xl flex flex-col items-center relative focus:outline-none">
            <h1 className="font-bold text-3xl capitalize mb-4">
                Vérifier votre adresse email
            </h1>
            <p className="text-center font-medium text-lg">
                Nous vous avons envoyé un code à six chiffres par e-mail à{" "}
                <span className="font-bold">{email}</span>. Entrez le code
                ci-dessous pour confirmer votre adresse e-mail.
            </p>
            <div className="w-full flex items-center gap-3 mt-5" id="codeForm">
                <Input
                    position={0}
                    disable={fieldsState}
                    inputRef={inputRefs[0]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
                <Input
                    position={1}
                    disable={fieldsState}
                    inputRef={inputRefs[1]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
                <Input
                    position={2}
                    disable={fieldsState}
                    inputRef={inputRefs[2]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
                <Input
                    position={3}
                    disable={fieldsState}
                    inputRef={inputRefs[3]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
                <Input
                    position={4}
                    disable={fieldsState}
                    inputRef={inputRefs[4]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
                <Input
                    position={5}
                    disable={fieldsState}
                    inputRef={inputRefs[5]}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    clearField={clearFields}
                />
            </div>
            {loading && (
                <div className="absolute h-full w-full bg-neutral rounded-2xl opacity-50 top-0 left-0 flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg text-secondary"></span>
                </div>
            )}
        </div>
    );
};

export default Validate;
