import { useAppSelector } from "../../../Hooks/redux";
import { useState, useEffect } from "react";

type props = {
    text: string;
    order: number;
};

const Step = ({ text, order }: props) => {
    const stepsData = useAppSelector(state => state.formSteps);

    const [classNames, setClassNames] = useState<string>("step");

    useEffect(() => {
        setClassNames(`
            step font-bold
            ${stepsData.current === order ? "step-info" : ""}
            ${
                stepsData.steps[order - 1].status === "done"
                    ? "step-success"
                    : ""
            }
            ${stepsData.steps[order - 1].status === "error" ? "step-error" : ""}
        `);
    }, [order, stepsData]);

    return <li className={classNames}>{text}</li>;
};

export default Step;
