import { useFormContext, Controller } from "react-hook-form";

const Radios = () => {
    const {
        control,
        setValue,
        formState: { errors },
        getValues,
    } = useFormContext();

    return (
        <div className="w-full flex  justify-center items-center">
            <div className="indicator">
                <span
                    className={`indicator-item badge font-medium ${
                        errors["titre"] && getValues("titre") == ""
                            ? "badge-error text-white"
                            : ""
                    }`}
                >
                    Obligatoire
                </span>
                <div className="input input-bordered px-10 flex gap-10 bg-base-100 ">
                    <div className="flex flex-col justify-center items-center">
                        <Controller
                            name="titre"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <input
                                        type="radio"
                                        id="radio-1"
                                        className="radio w-5 h-5"
                                        {...field} // Spread the field props
                                        onChange={() => setValue("titre", "M")} // Update the form state on change
                                    />
                                    <label
                                        htmlFor="radio-1"
                                        className="label-text font-bold hover:cursor-pointer"
                                    >
                                        M.
                                    </label>
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Controller
                            name="titre"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <input
                                        type="radio"
                                        className="radio w-5 h-5"
                                        id="radio-2"
                                        {...field} // Spread the field props
                                        onChange={() =>
                                            setValue("titre", "Mme")
                                        } // Update the form state on change
                                    />
                                    <label
                                        htmlFor="radio-2"
                                        className="label-text font-bold hover:cursor-pointer"
                                    >
                                        Mme.
                                    </label>
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Controller
                            name="titre"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <input
                                        type="radio"
                                        className="radio w-5 h-5"
                                        id="radio-3"
                                        {...field} // Spread the field props
                                        onChange={() =>
                                            setValue("titre", "Mlle")
                                        } // Update the form state on change
                                    />
                                    <label
                                        htmlFor="radio-3"
                                        className="label-text font-bold hover:cursor-pointer"
                                    >
                                        Mlle.
                                    </label>
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Radios;
