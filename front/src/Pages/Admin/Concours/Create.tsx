import Input from "../../../Components/FormElements/input";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select from "../../../Components/admin/Concours/create/Select";
import FileUpload from "../../../Components/fileUploader/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormRegistry from "../../../Hooks/admin/concours/useFormRegistry";
import cityChoiceHint from "../../../Utils/tours/Admin/Concours/cityChoiceHint";
import DragNDropCities from "../../../Components/admin/Concours/create/citiesDragNDrop/citiesDragNDrop";
import { useAppSelector } from "../../../Hooks/redux";
import useHelpers from "../../../Hooks/admin/concours/useHelpers";
import { IFormType } from "../../../Utils/interfaces/Admin/concours/IFormTypes";
import IntitulePanel from "../../../Components/admin/Concours/create/intitulePanel";
import Toast from "../../../Components/toast";
import { IConcours } from "../../../Utils/interfaces/Admin/concours/IConcours";

const CreateConcours = () => {
    const [directions, setDirections] = useState<IFormType[]>([]);
    const [postes, setPostes] = useState<IFormType[]>([]);
    const [grades, setGrades] = useState<IFormType[]>([]);
    const [branches, setBranches] = useState<IFormType[]>([]);
    const [specs, setSpecs] = useState<IFormType[]>([]);
    const { fetchOnLoad } = useHelpers({
        setDirections,
        setPostes,
        setGrades,
        setBranches,
        setSpecs,
    });

    useEffect(() => {
        fetchOnLoad();
    }, []);

    //explain: intitulePanel states ----------------------------------------
    const [intitulePanel, showIntitulePanel] = useState<boolean>(false);
    const [CustomLabelInput, showCustomLabelInput] = useState<boolean>(false);
    //----------------------------------------------------------------------
    const { avis } = useAppSelector(state => state.concours);
    const { alert } = useAppSelector(state => state.alert);
    const { schema, saveConcours } = useFormRegistry();

    const methods = useForm<IConcours>({
        resolver: zodResolver(schema),
    });

    const submit = (data: IConcours) => {
        saveConcours(data, emptyFields, showIntitulePanel, showCustomLabelInput);
    };

    //explain: This is used to add the cityChoiceHint tour
    useEffect(() => {
        cityChoiceHint
            .setOption("hintButtonLabel", "OK")
            .setOption("position", "right")
            .addHints();
    }, []);

    //explain: fileUpload states
    const [emptyFiles, shouldEmptyFiles] = useState(false);

    const emptyFields = (): void => {
        shouldEmptyFiles(true);
        methods.reset();
    };

    //explain: This is used to trigger the validation of the form before submitting
    const triggerValidation = () => {
        methods.clearErrors();
        methods.setValue("avis", avis);
        methods.trigger().then(() => {
            const errorKeys = Object.keys(methods.formState.errors);
            if (errorKeys.length === 1 && errorKeys[0] === "intitulé") {
                showIntitulePanel(true);
                methods.clearErrors();
            }
        });
    };

    return (
        <div className="w-full px-5">
            <div className="w-full flex flex-col flex-1 border-2 border-slate-300 rounded-3xl shadow-lg bg-base-300 py-5">
                <FormProvider {...methods}>
                    <form
                        className="flex-1 mt-2 flex flex-col overflow-y-auto"
                        onSubmit={methods.handleSubmit(submit)}
                    >
                        <div className="w-full flex justify-evenly border-2">
                            <Select
                                options={directions}
                                label="Direction"
                                reg="direction"
                            />
                        </div>
                        <div className="grid grid-cols-3 bg-slate-300 mx-10 my-3 p-5 rounded-xl shadow-lg">
                            <div className="col-span-2">
                                <div className="grid grid-cols-2 p-5 pb-8 rounded-xl bg-white">
                                    <h2 className="col-span-2 text-lg font-bold py-1 border-2 border-neutral-content rounded-full text-center">
                                        Type de concours
                                    </h2>
                                    <div className="flex justify-center">
                                        <Select
                                            options={postes}
                                            label="Poste"
                                            reg="poste"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={grades}
                                            label="Grade"
                                            reg="grade"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={branches}
                                            label="Branche"
                                            reg="branche"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={specs}
                                            label="Spécialité"
                                            reg="spécialité"
                                        />
                                    </div>
                                </div>
                                <div className=" mt-5 p-5 rounded-xl bg-white">
                                    <h2 className=" text-lg font-bold mb-3 py-1 border-2 border-neutral-content rounded-full text-center">
                                        Avis
                                    </h2>
                                    <FileUpload
                                        emptyFiles={emptyFiles}
                                        shouldEmptyFiles={shouldEmptyFiles}
                                        numberOfFiles={1}
                                        reg="avis"
                                    />
                                </div>
                            </div>
                            <div className="row-span-3 flex flex-col bg-white ml-5 p-5 rounded-xl">
                                <h2 className="col-span-2 text-lg font-bold mb-3 py-1 border-2 border-neutral-content rounded-full text-center">
                                    Détails
                                </h2>
                                <div className="flex-1 flex flex-col justify-center">
                                    {/* 
                                        //TODO: Make a custom input for numbers 
                                    */}
                                    <Input
                                        registerValue="maxPlaces"
                                        t_left_text="Nombre de places"
                                        placeholder=">= 1"
                                        type="number"
                                        changeIndicatorPlacement={true}
                                        customClasses="w-1/6 p-2 flex justify-center items-center text-center font-bold text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        customIndicatorStyle="border-1 border-neutral-content"
                                        min={1}
                                    />
                                    <Input
                                        registerValue="maxAge"
                                        t_left_text="Age maximum"
                                        placeholder="17 ~ 50"
                                        type="number"
                                        changeIndicatorPlacement={true}
                                        customClasses="p-2 flex justify-center items-center text-center font-bold text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min={17}
                                        max={50}
                                        customIndicatorStyle="border-1 border-neutral-content"
                                    />
                                    <Input
                                        registerValue="dateLimite"
                                        t_left_text="Date limite du dépôt des dossiers"
                                        placeholder="jj-mm-aaaa"
                                        changeIndicatorPlacement={true}
                                        customClasses={
                                            "text-center font-bold text-lg"
                                        }
                                        customIndicatorStyle="border-1 border-neutral-content"
                                    />
                                    <Input
                                        registerValue="dateConcours"
                                        t_left_text="Date du concours"
                                        placeholder="jj-mm-aaaa"
                                        changeIndicatorPlacement={true}
                                        customClasses={
                                            "text-center font-bold text-lg"
                                        }
                                        customIndicatorStyle="border-1 border-neutral-content"
                                    />
                                </div>
                            </div>
                            <div className="mt-5 p-5 rounded-xl bg-white w-full col-span-3">
                                <DragNDropCities />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <label
                                className="btn btn-wide btn-outline btn-success !text-neutral hover:!text-white"
                                onClick={triggerValidation}
                            >
                                Valider
                            </label>
                        </div>
                        {intitulePanel && (
                            <IntitulePanel
                                showIntitulePanel={showIntitulePanel}
                                direction={
                                    directions.filter(
                                        d =>
                                            d.id ===
                                            methods.getValues("direction"),
                                    )[0].label as string
                                }
                                poste={
                                    postes.filter(
                                        p =>
                                            p.id === methods.getValues("poste"),
                                    )[0].label as string
                                }
                                grade={
                                    grades.filter(
                                        g =>
                                            g.id === methods.getValues("grade"),
                                    )[0].label as string
                                }
                                CustomLabelInput={CustomLabelInput}
                                showCustomLabelInput={showCustomLabelInput}
                            />
                        )}
                    </form>
                </FormProvider>
            </div>
            {
                alert.status &&
                <Toast text="Concours créé avec succès" type="success" />
            }
        </div>
    );
};

export default CreateConcours;
