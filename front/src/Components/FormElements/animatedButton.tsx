import { ElementType } from "react";

type Props = {
    btnType?: "button" | "submit" | "reset";
    text: string;
    onClickFct?: () => void;
    customButtonClasses?: string[];
    Icon: ElementType;
    LoadingState?: boolean;
    ReverseAnimationDirection?: boolean;
    disabled?: boolean;
};

const AnimatedButton = ({
    text,
    onClickFct,
    Icon,
    customButtonClasses,
    btnType,
    LoadingState,
    ReverseAnimationDirection,
    disabled
}: Props) => {
    return (
        <button
            className={`btn group relative hover:bg-transparent hover:border-4 mt-4 ${
                customButtonClasses ? customButtonClasses.join(" ") : ""
            }`}
            onClick={() => {
                onClickFct && onClickFct(); // Invoke the function if provided
            }}
            type={btnType ? btnType : "button"}
            disabled={disabled}
        >
            <div
                className={`absolute flex justify-center w-1/3 ${
                    ReverseAnimationDirection ? "right-0" : "left-0"
                } top-1/2 transform -translate-y-1/2 invisible group-hover:visible ${
                    ReverseAnimationDirection
                        ? "group-hover:-translate-x-full"
                        : "group-hover:translate-x-full"
                } transition-transform duration-300`}
            >
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