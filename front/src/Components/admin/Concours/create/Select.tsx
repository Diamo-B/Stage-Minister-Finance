import { useFormContext } from "react-hook-form";

type option = {
    id: string;
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
            <div className="indicator w-full !z-10">
                <span
                    className={`indicator-item badge font-bold  border-1 border-neutral-content ${
                        errors[reg as string] ? "text-white bg-error" : ""
                    }`}
                >
                    Obligatoire
                </span>
                <select
                    className="select select-bordered w-64 "
                    {...register(reg)}
                >
                    <option hidden value={undefined}>
                        _ _ _ _ _ _
                    </option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Select;
