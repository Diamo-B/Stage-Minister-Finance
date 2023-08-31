//? React
import { ChangeEvent, useEffect } from "react";

//? react-hook-form adn zod validation
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDetailsForm } from "../../../../../Utils/interfaces/RegistrationForm/IDetailsForm";

//? Redux
import { useAppDispatch, useAppSelector } from "../../../../../Hooks/redux";
import {
    filterCities,
    resetFilterCities,
    selectCityId,
    selectRegionId,
} from "../../../../../Redux/RegisterationForm/Details";
import {
    changeStepStatus,
    stopSubmit,
} from "../../../../../Redux/RegisterationForm/formSteps";

//? Custom Hooks
import useGetData from "../../../../../Hooks/candidat/Register/step3/useGetData";
import useManipForm from "../../../../../Hooks/candidat/Register/step3/useManipForm";

const Form = () => {
    const dispatch = useAppDispatch();

    const { regions, cities, filtredCities, selectedRegionId } = useAppSelector(
        state => state.details,
    );
    const { submitState, current } = useAppSelector(state => state.formSteps);

    //!------------------------------------------------------------------------------------------------------

    //explain this sets the step number inside the localStorage
    useEffect(() => {
        localStorage.setItem("step", "3");
    }, []);

    //!------------------------------------------------------------------------------------------------------

    const { getRegions, getCities } = useGetData();

    //explain: the useEffect is used to get the regions and cities from the API
    useEffect(() => {
        if (regions.length == 0) getRegions();
        if (cities.length == 0) getCities();
    }, []);

    //!------------------------------------------------------------------------------------------------------

    const { schema } = useManipForm();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IDetailsForm>({
        resolver: zodResolver(schema),
    });

    //explain: watch for errors then change the step status to error (red step number)
    useEffect(() => {
        if (Object.keys(errors).length > 0)
            dispatch(
                changeStepStatus({
                    order: current,
                    status: "error",
                }),
            );
        else {
            dispatch(
                changeStepStatus({
                    order: current,
                    status: "pending",
                }),
            );
        }
    }, [errors]);

    //!------------------------------------------------------------------------------------------------------

    const { saveUserDetails } = useManipForm();

    //explain: the submit function is used to call the saveUserDetails from the "useManipForm" custom hook to save the user details
    const submit: SubmitHandler<IDetailsForm> = data => {
        saveUserDetails(data);
    };

    //explain: the Submit function is used to call the submit handler function
    const Submit = handleSubmit(submit);

    //explain: the useEffect is used to call the Submit function when the submitState is true (when the user clicks on the next button (suivant) ) then stop the submitState
    useEffect(() => {
        if (submitState === true) {
            Submit();
            dispatch(stopSubmit());
        }
    }, [submitState]);

    //!------------------------------------------------------------------------------------------------------

    //explain: The populateCities function is used on regions input change => it sets the selected region which activates the next useEffect
    const populateCities = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== "") {
            dispatch(resetFilterCities());
            dispatch(selectRegionId(parseInt(e.target.value)));
        }
    };

    //explain: the useEffect is used to filter the cities when a region is selected (gets the cities of the selected region into the filtredCities array from the cities array)
    useEffect(() => {
        dispatch(filterCities());
    }, [selectedRegionId]);

    //explain: the selectCity function is used to select a city
    const selectCity = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== "") dispatch(selectCityId(e.target.value));
    };

    return (
        <div className="w-11/12 p-10 bg-base-200 rounded-2xl flex flex-col items-center relative focus:outline-none">
            <form className="w-full rounded-xl bg-base-300 p-5">
                <div className="w-full h-full">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text font-bold`}>
                                Entrer votre adresse (ligne 1)
                            </span>
                            <div
                                className={`badge badge-md font-medium ${
                                    errors.adresse1 ? "bg-error text-white" : ""
                                }`}
                            >
                                Obligatoire
                            </div>
                        </label>

                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered font-medium w-full placeholder:font-normal"
                            {...register("adresse1")}
                        />
                    </div>
                </div>
                <div className="w-full h-full">
                    <div className="form-control w-full ">
                        <label className="label">
                            <span className="label-text font-bold">
                                Entrer votre adresse (ligne 2)
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered font-medium w-full placeholder:font-normal"
                            {...register("adresse2")}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 place-content-center justify-items-center gap-5">
                    <div className="w-full h-full">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">
                                    Choisissez votre région de résidence
                                </span>
                                <div
                                    className={`badge badge-md font-medium ${
                                        errors.region
                                            ? "bg-error text-white"
                                            : ""
                                    }`}
                                >
                                    Obligatoire
                                </div>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                {...register("region", {
                                    valueAsNumber: true,
                                    onChange: populateCities,
                                })}
                            >
                                <option value={""} defaultChecked hidden>
                                    _ _ _ _ _
                                </option>
                                {regions.map(region => (
                                    <option key={region.id} value={region.id}>
                                        {region.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-full">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">
                                    Choisissez votre ville de résidence
                                </span>
                                <div
                                    className={`badge badge-md font-medium ${
                                        errors.ville
                                            ? "bg-error text-white"
                                            : ""
                                    }`}
                                >
                                    Obligatoire
                                </div>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                {...register("ville", { onChange: selectCity })}
                            >
                                <option value={""} defaultChecked hidden>
                                    _ _ _ _ _
                                </option>
                                {filtredCities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-full  relative">
                        <label className="label h-1/2 flex justify-between items-center">
                            <span
                                className={`label-text font-bold ${
                                    errors.zip?.type === "too_small" &&
                                    errors.zip.ref?.value !== ""
                                        ? "text-red-400"
                                        : ""
                                }`}
                            >
                                {errors.zip?.type === "too_small" &&
                                errors.zip.ref?.value !== ""
                                    ? "Le code ZIP doit être composé de 5 chiffres"
                                    : "ZIP code"}
                            </span>
                            <div
                                className={`badge badge-md font-medium ${
                                    errors.zip?.ref?.value === ""
                                        ? "bg-error text-white"
                                        : ""
                                }`}
                            >
                                Obligatoire
                            </div>
                        </label>
                        <input
                            type="number"
                            placeholder="_ _ _ _ _"
                            {...register("zip", {
                                valueAsNumber: true,
                                onChange(event) {
                                    if (event.target.value.length > 5)
                                        event.target.value =
                                            event.target.value.slice(0, 5);
                                },
                            })}
                            className="input input-bordered w-full font-medium absolute bottom-0 placeholder:font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form;
