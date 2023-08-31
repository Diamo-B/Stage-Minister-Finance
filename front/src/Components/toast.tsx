import { UilTimesCircle } from "@iconscout/react-unicons";
import { useAppDispatch } from "../Hooks/redux";
import { useEffect } from "react";
import { disableAlert } from "../Redux/alerts";

type Props = {
    text: string;
    type: string;
};
const Toast = ({ text, type }: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {

        setTimeout(() => {
            dispatch(disableAlert());
        },5000) 

    }, []);

    return (
        <div className="toast w-80">
            <div
                className={`alert alert-${type} flex justify-center hover:alert-error hover:cursor-pointer min-w-full group relative`}
                onClick={() => dispatch(disableAlert())}
            >
                <span className="text-white font-bold text-center group-hover:hidden">
                    {text}
                </span>
                <span className="text-white font-bold invisible group-hover:visible">
                    <UilTimesCircle className="w-8 h-8"/>
                </span>
            </div>
        </div>
    );
};

export default Toast;
