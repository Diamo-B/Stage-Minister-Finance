//?Icons
import { UilArrowLeft, UilArrowRight } from "@iconscout/react-unicons";
//?components
import Step from "./step";
//?Redux
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { enablesubmit } from "../../redux/RegisterationForm/formSteps";

const Steps = () => {
    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.formSteps);
    const { verificationResult } = useAppSelector(state => state.validation);
    const { diplomes } = useAppSelector(state => state.diplomes);
    const { attachmentsRecords } = useAppSelector(state => state.lastStep);
    const { loading } = useAppSelector(state => state.loading);
    return (
        <div className="w-full flex items-center justify-around mb-10">
            <button
                className="PrevXnext "
                type="button"
                id="return"
                disabled={current == 2 && verificationResult === true}
            >
                <UilArrowLeft /> Précédent
            </button>
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
                    (current == 5 && attachmentsRecords?.length == 0) //?step5
                }
            >
                {current === 5 ? "Terminer" : "Suivant"} <UilArrowRight />
            </button>
        </div>
    );
};

export default Steps;
