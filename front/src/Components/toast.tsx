import { UilTimesCircle } from "@iconscout/react-unicons";

type Props = {
    text: string;
    type: string;
};
const Toast = ({ text, type }: Props) => {
    return (
        <div className="toast w-80">
            <div
                className={`alert alert-${type} flex justify-center hover:alert-error hover:cursor-pointer min-w-full group relative`}
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
