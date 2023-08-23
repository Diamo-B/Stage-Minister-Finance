import Select from "./Select";
import FileUpload from "../../../../../fileUploader/fileUploader";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { IDiplomeForm } from "../../../../../../utils/interfaces/RegistrationForm/IDiplomeForm";
import useFormRegistry from "../../../../../../hooks/candidat/Register/step4/useFormRegistry";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import { stopLoading } from "../../../../../../redux/loading";
import { changeStepStatus } from "../../../../../../redux/RegisterationForm/formSteps";

const Form = () => {
    const dispatch = useAppDispatch();
    const { countries, universities, types, spécialités, filières, files } =
        useAppSelector(state => state.diplomes);
    const { schema, FetchDataOnLoad, FormSubmition } = useFormRegistry();

    const methods = useForm<IDiplomeForm>({
        resolver: zodResolver(schema),
    });

    const [emptyFiles, shouldEmptyFiles] = useState<boolean>(false);

    const submit: SubmitHandler<IDiplomeForm> = data => {
        shouldEmptyFiles(true);
        FormSubmition(data, shouldEmptyFiles, methods.reset);
    };

    const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        dispatch(stopLoading());
        setYears(() => {
            const currentYear = new Date().getFullYear();
            const yearsArray = [];

            for (let year = currentYear; year >= 1970; year--) {
                yearsArray.push(year);
            }
            return yearsArray;
        });

        FetchDataOnLoad();
    }, []);

    const { loading } = useAppSelector(state => state.loading);

    useEffect(() => {
        if (Object.values(methods.formState.errors).length > 0)
            dispatch(changeStepStatus({ order: 4, status: "error" }));
    }, [methods.formState.errors]);

    return (
        <FormProvider {...methods}>
            <form
                className="mx-auto w-11/12"
                onSubmit={methods.handleSubmit(submit)}
            >
                <div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">
                                Intitulé du diplôme
                            </span>
                            <span
                                className={`badge font-bold ${
                                    methods.formState.errors.intitule
                                        ? "text-white bg-error"
                                        : ""
                                }`}
                            >
                                Obligatoire
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="exemple: Ingénieur d'état en informatique et réseaux option MIAGE"
                            className="input input-bordered w-full"
                            {...methods.register("intitule")}
                        />
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 justify-between">
                    <Select
                        label="Établissement"
                        options={universities}
                        reg="etablissement"
                    />
                    <div className="flex justify-end">
                        <Select
                            label="Type de diplôme"
                            options={types}
                            reg="type"
                        />
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 justify-between">
                    <Select
                        label="Pays d'obtention"
                        options={countries}
                        reg="pays"
                    />
                    <div className="flex justify-end">
                        <Select
                            label="Année d'obtention"
                            options={years}
                            reg="annee"
                        />
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 justify-between">
                    <Select label="Filière" options={filières} reg="filiere" />
                    <div className="flex justify-end">
                        <Select
                            label="Spécialité"
                            options={spécialités}
                            reg="specialite"
                        />
                    </div>
                </div>
                <div className="w-full mt-5">
                    <FileUpload
                        emptyFiles={emptyFiles}
                        shouldEmptyFiles={shouldEmptyFiles}
                        reg="files"
                        numberOfFiles={2}
                    />
                </div>
                <div className="mt-5 flex justify-center">
                    <button
                        className="btn btn-wide bg-base-200 hover:bg-white"
                        type="submit"
                        onClick={() => {
                            methods.setValue("files", files);
                        }}
                    >
                        {!loading ? (
                            "Ajouter Diplôme"
                        ) : (
                            <span className="loading loading-spinner"></span>
                        )}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default Form;
