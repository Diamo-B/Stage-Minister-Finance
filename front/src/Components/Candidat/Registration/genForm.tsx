import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux";
import Steps from "./stepsLine";
import Form from "./MultiStepForm/step1/Form";
import Form5 from "./MultiStepForm/step5/Form";
import DetailsForm from "./MultiStepForm/step3/form";
import Validate from "./MultiStepForm/step2/Validate";
import SecondMail from "./MultiStepForm/step2/secondMail";
import Diplomes from "./MultiStepForm/step4/DiplomesForm";
import useGenForm from "../../../hooks/candidat/Register/useGenForm";
import Alert from "../../FormElements/alert";
import Summary from "./MultiStepForm/Summary";

const GenForm = () => {
    const { current } = useAppSelector(state => state.formSteps);
    const { tab } = useAppSelector(state => state.formTabs);
    const { alert } = useAppSelector(state => state.alert);

    const { regainStepState } = useGenForm();
    useEffect(() => {
        regainStepState();
    }, []);

    return (
        <div
            className={`${
                (current === 4 && tab === 2) || current === 5
                    ? "lg:w-full lg:mx-6 2xl:w-3/4"
                    : "lg:w-3/4 2xl:w-2/4"
            } lg:py-4 2xl:py-10 bg-primary-content dark:bg-neutral flex flex-col justify-center items-center rounded-2xl shadow-md`}
        >
            {/* responsive tailwind reference example ( only approx. ) */}
            {/* class xl: my laptop 1366*768 -> 55 inch huge screen*/}
            {/* class 2xl: 55 inch and higher */}
            <Steps />
            {alert.status === true ? <Alert /> : ""}
            {current === 1 && <Form />}
            {current === 2 && (
                <>
                    <Validate />
                    <SecondMail />
                </>
            )}
            {current === 3 && <DetailsForm />}
            {current === 4 && <Diplomes />}
            {current === 5 && <Form5 />}
            {current === 6 && <Summary />}
        </div>
    );
};

export default GenForm;
