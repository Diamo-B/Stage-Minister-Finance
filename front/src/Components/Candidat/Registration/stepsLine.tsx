//?Icons
import { UilArrowLeft, UilArrowRight } from "@iconscout/react-unicons";
//?components
import Step from "./step";
//?Redux
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import { changeStep, changeStepStatus, enablesubmit } from "../../../Redux/RegisterationForm/formSteps";
import ConfirmationPanel from "../../FormElements/confirmationPanel";
import { hideConfirmationPanel, showConfirmationPanel } from "../../../Redux/confirmationPanel";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Steps = () => {
    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.formSteps);
    const { show, isConfirmed } = useAppSelector(state => state.confirmationPanel);
    const { verificationResult } = useAppSelector(state => state.validation);
    const { diplomes } = useAppSelector(state => state.diplomes);
    const { attachmentsRecords } = useAppSelector(state => state.lastStep);
    const { loading } = useAppSelector(state => state.loading);

    const navigate = useNavigate();
    useEffect(()=>{
        //! this is important to read
        //explain: Only at step 1, if the user clicks on the cancel registration button (Annuler), he gets a ConfirmationPanel component, when he confirms it, it takes him to the login page
        //! removing the current===1 part will result in bad bugs throughout the whole app
        if(isConfirmed && current === 1)
        {
            dispatch(hideConfirmationPanel());
            navigate("/login");
        }
    },[isConfirmed])


    return (
        <div className="w-full flex items-center justify-around mb-10">
            {current === 1 ? (
                <button
                    className="PrevXnext hover:bg-error hover:text-white"
                    type="button"
                    onClick={() => {
                        dispatch(
                            showConfirmationPanel({
                                text: "Voulez-vous vraiment annuler l'inscription ?",
                                itemIdentifier: undefined,
                            }),
                        );
                    }}
                >
                    Annuler
                </button>
            ) : (
                <button
                    className="PrevXnext "
                    type="button"
                    id="return"
                    disabled={
                        (current === 2 && verificationResult === true) ||
                        current === 3 ||
                        current === 6 //? this is the summary page
                    }
                    onClick={() => {
                        dispatch(
                            changeStepStatus({
                                order: current,
                                status: "pending",
                            }),
                        );
                        dispatch(changeStep(current - 1));
                    }}
                >
                    <UilArrowLeft /> Précédent
                </button>
            )}

            <ul className="steps text-sm">
                <Step text="S'inscrire" order={1} />
                <Step text="Vérification" order={2} />
                <Step text="Détails" order={3} />
                <Step text="Diplômes" order={4} />
                <Step text="Pièces jointes" order={5} />
            </ul>
            <button
                className="PrevXnext"
                id="success"
                onClick={() => dispatch(enablesubmit())}
                disabled={
                    loading ||
                    (current == 2 && verificationResult !== true) || //?step2
                    (current == 4 && diplomes.length == 0) || //?step4
                    (current == 5 && attachmentsRecords?.length == 0) || //?step5
                    current === 6 //?summary
                }
            >
                {current >= 5 ? "Terminer" : "Suivant"} <UilArrowRight />
            </button>
            {show && <ConfirmationPanel customConfirmButton="Confirmer"/>}
        </div>
    );
};

export default Steps;
