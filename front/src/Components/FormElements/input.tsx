import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UilEyeSlash, UilEye } from "@iconscout/react-unicons";
type InputProps = {
    registerValue?: string;
    placeholder?: string;
    t_left_text: string;
    t_right_text?: string;
    b_left_text?: string;
    b_right_text?: string;
    type?: string;
    changeIndicatorPlacement?: boolean;
    customIndicatorText?: string;
    customIndicatorStyle?: string;
    customClasses?: string;
    min?: number;
    max?: number;
    defaultValue?: string;
};

const Input: FC<InputProps> = (props): JSX.Element => {
    const {
        register,
        formState: { errors },
        getValues,
    } = useFormContext();

    const [showPassword, setShowPassword] = useState<boolean | null>(props.type === "password" ? false : null);

    return (
        <div className="form-control w-full flex justify-center items-center">
            <label
                className={`label ${
                    props.changeIndicatorPlacement ? "w-72" : ""
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
                        <span className="label-text font-bold">
                            {props.t_left_text}
                        </span>
                    )
                )}
                {props.changeIndicatorPlacement && (
                    <span
                        className={`badge font-bold 
                        ${
                            props.registerValue && errors[props.registerValue]
                                ? "badge-error text-white"
                                : ""
                        }
                        ${
                            props.customIndicatorStyle
                                ? props.customIndicatorStyle
                                : ""
                        }`}
                    >
                        {props.customIndicatorText
                            ? props.customIndicatorText
                            : "Obligatoire"}
                    </span>
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
                    {showPassword !== null && (
                        <label className="swap absolute right-3 top-3 z-50">
                            <input
                                type="checkbox"
                                onChange={e => {
                                    if (e.target.checked) {
                                        setShowPassword(true);
                                    } else {
                                        setShowPassword(false);
                                    }
                                }}
                            />
                            <UilEye className="swap-on" />
                            <UilEyeSlash className="swap-off" />
                        </label>
                    )}
                    <input
                        type={
                            showPassword === null
                                ? props.type
                                    ? props.type
                                    : "text"
                                : showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder={props.placeholder}
                        className={`input input-bordered w-72 join-item ${props.customClasses}`}
                        min={props.type === "number" ? props.min : undefined}
                        max={props.type === "number" ? props.max : undefined}
                        value={props.defaultValue}
                        {...register(props.registerValue as string)}
                    />
                </div>
            ) : (
                <div className="relative">
                    {showPassword !== null && (
                        <label className="swap absolute right-3 top-3 z-50">
                            <input
                                type="checkbox"
                                onChange={e => {
                                    if (e.target.checked) {
                                        setShowPassword(true);
                                    } else {
                                        setShowPassword(false);
                                    }
                                }}
                            />
                            <UilEye className="swap-on" />
                            <UilEyeSlash className="swap-off" />
                        </label>
                    )}
                    <input
                        type={
                            showPassword === null
                                ? props.type
                                    ? props.type
                                    : "text"
                                : showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder={props.placeholder}
                        className={`input input-bordered w-72 join-item ${props.customClasses}`}
                        min={props.type === "number" ? props.min : undefined}
                        max={props.type === "number" ? props.max : undefined}
                        value={props.defaultValue}
                        {...register(props.registerValue as string)}
                    />
                </div>
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
