import Table from "../Table";
import { useEffect } from "react";
import AddForm from "./Form/Form";
import { useAppDispatch, useAppSelector } from "../../../../../Hooks/redux";
import { resetFiles } from "../../../../../Redux/RegisterationForm/diplomes";
import {
    changeStepStatus,
    incrementStep,
    stopSubmit,
} from "../../../../../Redux/RegisterationForm/formSteps";
import Tabs from "../tabs";
import useHelpers from "../../../../../Hooks/candidat/Register/step4/useHelpers";
import AddedDiploma from "../../../../../Utils/tours/RegistrationForm/diplomes/AddedDiplomaTour";

const Form = () => {
    const dispatch = useAppDispatch();
    const { diplomes } = useAppSelector(state => state.diplomes);
    const { tab } = useAppSelector(state => state.formTabs);
    const { current, submitState } = useAppSelector(state => state.formSteps);

    const { deleteDiplome, getCandidatDiplomas } = useHelpers();

    //explain: this sets the step number inside the localStorage
    useEffect(() => {
        localStorage.setItem("step", "4");
        dispatch(resetFiles());
    }, []);

    //explain: this validates the step if one or more diplomas are added
    useEffect(() => {
        if (diplomes.length > 0) {
            dispatch(changeStepStatus({ order: 4, status: "done" }));
        } else {
            dispatch(changeStepStatus({ order: 4, status: "pending" }));
        }
    }, [diplomes]);

    //explain: this fetches the diplomas of the candidat if he entered this step before
    useEffect(() => {
        if (diplomes.length > 0) return;
        const token = localStorage.getItem("RegistrationToken");
        if (token) {
            getCandidatDiplomas(token);
        }
    }, []);

    //explain: this passes to the nextStep if the (suivant) button is clicked
    useEffect(() => {
        if (submitState) {
            dispatch(changeStepStatus({ order: current, status: "done" }));
            dispatch(incrementStep());
            dispatch(stopSubmit());
        }
    }, [submitState]);

    return (
        <div className="w-11/12 p-10 bg-base-200 rounded-2xl">
            <div className="flex flex-col w-full border-opacity-50 items-center">
                <div className="rounded-box bg-base-300">
                    <Tabs
                        tab1Text="Ajouter un nouvel diplôme"
                        tab2Text="Consulter les diplômes ajoutés"
                        tour={AddedDiploma}
                    />
                </div>
                <div className="bg-base-300 border-4 border-base-300 rounded-box py-10 w-full">
                    {tab === 1 && <AddForm />}
                    {tab === 2 && (
                        <Table
                            deleteRecord={deleteDiplome}
                            Records={diplomes}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Form;
