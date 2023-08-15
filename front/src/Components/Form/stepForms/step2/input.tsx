import { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { InputRef } from "./Validate";

type Props = {
    position: number;
    disable: boolean;
    inputRef: InputRef; // <-- `inputRef` prop is of type RefObject<HTMLInputElement>
    handleInputChange: (index: number, value: string) => void;
    handleKeyDown: (
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) => void;
    clearField: boolean;
};

const Input = ({
    position,
    disable,
    inputRef,
    clearField,
    handleInputChange,
    handleKeyDown,
}: Props) => {
    const { verificationResult } = useAppSelector(state => state.validation);
    const { loading } = useAppSelector(state => state.loading);

    const [num, setNum] = useState("");

    const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
        const limit = 1;
        setNum(event.target.value.slice(0, limit));

        if (event.target.value.length > 0) {
            handleInputChange(position, event.target.value.slice(0, limit));
        }
    };

    const handleDeleteNum = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            handleKeyDown(position, event);
        }
    };

    useEffect(() => {
        if (clearField) {
            setNum("");
        }
    }, [clearField]);

    return (
        <input
            type="number"
            className={`
            ${verificationResult && !loading ? "!border-emerald-400" : ""}
          ${!loading && verificationResult === false ? "border-red-400" : ""} 
          w-1/6 p-2 h-36 rounded-2xl border-2 border-primary-content flex justify-center items-center text-center font-bold text-4xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            ref={inputRef.ref}
            min={0}
            max={9}
            maxLength={1}
            value={num}
            autoFocus={position === 0} // Auto focus the first input
            onKeyDown={event => {
                handleDeleteNum(event);
            }}
            onChange={e => {
                handleNumChange(e);
            }}
            disabled={disable}
        />
    );
};

export default Input;
