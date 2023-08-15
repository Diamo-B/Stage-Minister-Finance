import { useFormContext } from "react-hook-form";

type option = {
    value: string;
    label: string;
};

type Props = {
    options: option[];
    label: string;
    reg: string;
};

const Select = ({ options, label, reg }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control">
            <label className="label w-full flex justify-center">
                <span className="label-text font-bold">{label}</span>
            </label>
            <div className="indicator w-full">
                <span
                    className={`indicator-item badge font-bold ${
                        errors[reg] ? "text-white bg-error" : ""
                    }`}
                >
                    Obligatoire
                </span>
                <select
                    className="select select-bordered w-72"
                    {...register(reg)}
                >
                    <option hidden value={undefined}>
                        _ _ _ _ _ _
                    </option>
                </select>
            </div>
        </div>
    );
};

export default Select;
