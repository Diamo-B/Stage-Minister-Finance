import { useFormContext } from "react-hook-form";
import { filière } from "../../../../../../Redux/RegisterationForm/types/diplomesTypes";

type option = {
    id: string | number;
    nom: string;
    code?: string;
};

type Props = {
    label: string;
    options: option[] | number[] | filière[];
    reg: string;
};

const Select = ({ label, options, reg }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control w-full max-w-xs">
            <label className="label w-full">
                <span className="label-text">{label}</span>
                <span
                    className={`badge font-bold ${
                        errors[reg] ? "text-white bg-error" : ""
                    }`}
                >
                    Obligatoire
                </span>
            </label>
            <select className="select select-bordered" {...register(reg)}>
                <option hidden value={undefined}>
                    _ _ _ _ _ _
                </option>
                {options.map((opt, index) => (
                    <option
                        key={
                            typeof opt === "object" && opt.id !== undefined
                                ? opt.id.toString()
                                : index.toString()
                        }
                        value={
                            typeof opt === "number"
                                ? opt
                                : typeof opt === "object" &&
                                  opt.id !== undefined
                                ? opt.id.toString()
                                : index.toString()
                        }
                    >
                        {typeof opt === "number" ? opt : (opt as option).nom}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
