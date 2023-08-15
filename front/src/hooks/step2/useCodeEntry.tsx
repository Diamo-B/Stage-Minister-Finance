import { InputRef } from "../../Components/Form/stepForms/step2/Validate";
import { verificationIdle } from "../../redux/RegisterationForm/Validate";
import { useAppDispatch } from "../redux";

type Props = {
    inputRefs: InputRef[];
    setCount: React.Dispatch<React.SetStateAction<number>>;
};

const useCodeEntry = ({ inputRefs, setCount }: Props) => {
    const dispatch = useAppDispatch();

    //explain: Function to focus on the next input
    const focusNextInput = (index: number): void => {
        if (index < inputRefs.length - 1) {
            dispatch(verificationIdle());
            inputRefs[index + 1].ref.current?.focus();
        }
    };

    //explain: Function to increment the count whenever a value is entered then focus on the next input
    const handleInputChange = (index: number, value: string): void => {
        inputRefs[index].ref.current!.value = value;
        inputRefs[index].isFilled = true;
        setCount(prev => {
            if (prev < 6) {
                return prev + 1;
            } else {
                return prev; // Return the previous value when the condition is not met
            }
        });
        focusNextInput(index);
    };

    //explain: Function to decrement the count whenever the backspace key is pressed then focus on the previous input
    const handleKeyDown = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
        if (event.key === "Backspace") {
            dispatch(verificationIdle());
            const currentInput = inputRefs[index].ref.current;

            if (currentInput) {
                const currentInputValue = currentInput.value;
                if (currentInputValue === "" && index > 0) {
                    setTimeout(
                        () => inputRefs[index - 1].ref.current?.focus(),
                        0,
                    );
                } else if (currentInputValue !== "") {
                    setCount(prev => {
                        if (prev > 0) {
                            return prev - 1;
                        } else {
                            return prev; // Return the previous value when the condition is not met
                        }
                    });
                    currentInput.value = ""; // TypeScript shouldn't complain now
                }
            }
        }
    };

    return { handleInputChange, handleKeyDown };
};

export default useCodeEntry;
