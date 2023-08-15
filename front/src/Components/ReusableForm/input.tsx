import { FC } from "react";
import { useFormContext } from "react-hook-form";
type InputProps = {
    registerValue?: string;
    placeholder?: string;
    t_left_text: string;
    t_right_text?: string;
    b_left_text?: string;
    b_right_text?: string;
    type?: string;
    changeIndicatorPlacement?: boolean;
};

const Input: FC<InputProps> = (props): JSX.Element => {
    const {
        register,
        formState: { errors },
        getValues,
    } = useFormContext();

    return (
        <div className="form-control w-full flex justify-center items-center">
            <label
                className={`label ${
                    props.changeIndicatorPlacement ? "w-full px-5" : ""
                }`}
            >
                {props.registerValue &&
                errors[props.registerValue] &&
                getValues(props.registerValue) !== "" ? (
                    <span className="label-text text-red-500 font-bold">
                        {errors[props.registerValue]?.message as string}
                    </span>
                ) : (
                    props.t_left_text && (
                        <span className='label-text font-bold'>
                            {props.t_left_text}
                        </span>
                    )
                )}
                {props.changeIndicatorPlacement && (
                    <span className="badge font-bold">Obligatoire</span>
                )}
                {props.t_right_text && (
                    <span className="label-text-alt">{props.t_right_text}</span>
                )}
            </label>
            {!props.changeIndicatorPlacement ? (
                <div className="indicator">
                    <span
                        className={`indicator-item badge font-medium ${
                            props.registerValue &&
                            errors[props.registerValue] &&
                            getValues(props.registerValue) == ""
                                ? "badge-error text-white"
                                : ""
                        }`}
                    >
                        Obligatoire
                    </span>
                    <input
                        type={props.type ? props.type : "text"}
                        placeholder={props.placeholder}
                        className="input input-bordered w-72 join-item"
                        {...register(props.registerValue as string)}
                    />
                </div>
            ) : (
                <input
                    type={props.type ? props.type : "text"}
                    placeholder={props.placeholder}
                    className="input input-bordered w-72 join-item"
                    {...register(props.registerValue as string)}
                />
            )}
            <label className="label">
                {props.b_left_text && (
                    <span className="label-text-alt">{props.b_left_text}</span>
                )}
                {props.b_right_text && (
                    <span className="label-text-alt">{props.b_right_text}</span>
                )}
            </label>
        </div>
    );
};

export default Input;
