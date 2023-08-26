import { ElementType } from "react";

type Props = {
    btnType?: "button" | "submit" | "reset";
    text: string;
    onClick?: () => void;
    customButtonClasses?: string[];
    Icon: ElementType;
    LoadingState?: boolean;
};

const AnimatedButton = ({
    text,
    onClick,
    Icon,
    customButtonClasses,
    btnType,
    LoadingState
}: Props) => {
    return (
        <button
            className={`btn group relative hover:bg-transparent hover:border-4 mt-4 ${
                customButtonClasses ? customButtonClasses.join(" ") : ""
            }`}
            onClick={() => {
                onClick && onClick();
            }}
            type={btnType ? btnType : "button"}
        >
            <div className="absolute w-1/3 left-0 top-1/2 transform -translate-y-1/2 invisible group-hover:visible group-hover:translate-x-full transition-transform duration-300">
                <Icon />
            </div>
            <p className="group-hover:invisible">
                {LoadingState ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : (
                    text
                )}
            </p>
        </button>
    );
};
 
export default AnimatedButton;