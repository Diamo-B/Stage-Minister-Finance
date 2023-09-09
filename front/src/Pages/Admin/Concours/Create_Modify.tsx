import Input from "../../../Components/FormElements/input";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select from "../../../Components/admin/Concours/create/Select";
import FileUpload from "../../../Components/fileUploader/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormRegistry from "../../../Hooks/admin/concours/create/useFormRegistry";
import DragNDropCities from "../../../Components/admin/Concours/create/citiesDragNDrop/citiesDragNDrop";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import useHelpers from "../../../Hooks/admin/concours/create/useHelpers";
import { IFormType } from "../../../Utils/interfaces/Admin/concours/IFormTypes";
import IntitulePanel from "../../../Components/admin/Concours/create/intitulePanel";
import Toast from "../../../Components/toast";
import { IConcours } from "../../../Utils/interfaces/Admin/concours/IConcours";
import { z } from "zod";
import { TCity } from "../../../Redux/Admin/concours/types/create";
import { UilArrowLeft } from "@iconscout/react-unicons";
import AnimatedButton from "../../../Components/FormElements/animatedButton";
import { useLocation, useNavigate } from "react-router-dom";
import { concoursType } from "../../../Redux/Admin/concours/types/manage";
import {
    startGenPageLoading,
    stopGenPageLoading,
} from "../../../Redux/loading";

const CreateModifyConcours = () => {
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
    const { avis } = useAppSelector(state => state.concoursCreation);
    const { alert } = useAppSelector(state => state.alert);
    const { schema, saveConcours } = useFormRegistry();

    const methods = useForm<IConcours>({
        resolver: zodResolver(schema),
    });

    const submit = (data: IConcours) => {
        saveConcours(data, emptyFields);
    };

    //explain: fileUpload states
    const [emptyFiles, shouldEmptyFiles] = useState(false);

    const emptyFields = (): void => {
        shouldEmptyFiles(true);
        methods.reset();
        setSelectedCities([]); //? this for preventing the cities table from being undefined and triggering an error on submit when it shouldn't
    };

    //explain: This is used to trigger the validation of the form before submitting (when clicking the valider button)
    const triggerValidation = () => {
        methods.clearErrors();
        methods.setValue("avis", avis);
        methods.trigger().then(() => {
            const errorKeys = Object.keys(methods.formState.errors);
            console.log(errorKeys);

            if (errorKeys.length === 1 && errorKeys[0] === "intitulé") {
                showIntitulePanel(true);
                methods.clearErrors();
            }
        });
    };

    //explain: These are the props values for the intitulePanel with their update
    const [selectedDirection, setSelectedDirection] = useState<string>("");
    const [selectedPoste, setSelectedPoste] = useState<string>("");
    const [selectedGrade, setSelectedGrade] = useState<string>("");

    useEffect(() => {
        const schema = z.string().uuid();
        if (directions && postes && grades) {
            if (
                schema.safeParse(methods.getValues("direction")).success ===
                true
            ) {
                setSelectedDirection(
                    directions.filter(
                        d => d.id === methods.getValues("direction"),
                    )[0].label as string,
                );
            }
            if (schema.safeParse(methods.getValues("poste")).success === true) {
                setSelectedPoste(
                    postes.filter(p => p.id === methods.getValues("poste"))[0]
                        .label as string,
                );
            }
            if (schema.safeParse(methods.getValues("grade")).success === true) {
                setSelectedGrade(
                    grades.filter(g => g.id === methods.getValues("grade"))[0]
                        .label as string,
                );
            }
        }
    }, [
        methods.getValues("direction"),
        methods.getValues("poste"),
        methods.getValues("grade"),
    ]);

    //explain: this is the state used to track selected cities
    const [selectedCities, setSelectedCities] = useState<TCity[]>([]);

    //explain: this is the state defining whether this is a creation or an update
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [isModify, setIsModify] = useState<concoursType | null>(
        location.state?.isModify,
    );

    useEffect(() => {
        //explain: In the case of a modification, fetch the 'avis' file's data from the database
        if (isModify?.avis.id !== undefined && isModify?.avis.id !== null && !isModify?.avis.file) {
            dispatch(startGenPageLoading());
            fetch(
                `${
                    import.meta.env.VITE_BackendBaseUrl
                }/attachment/get/${isModify?.avis.id}/data`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "AccessToken",
                        )}`,
                    },
                },
            )
                .then(async res => {
                    const response = await res.json();
                    fetch(response.data_base64).then(async res => {
                        const blob = await res.blob();
                        const fileName = isModify?.avis.path
                            .replace("./public/Concours/", "")
                            .split("/")[1];
                        const fileExtension = fileName?.split(".")[1];
                        const f = new File([blob], fileName!!, {
                            type:
                                fileExtension === "pdf"
                                    ? "application/pdf"
                                    : `image/${fileExtension}`,
                        });
                        const updatedAvis = { ...isModify.avis, file: f };
                        setIsModify({ ...isModify, avis: updatedAvis });
                        isModify.avis.file = f;
                    });
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    dispatch(stopGenPageLoading());
                });
        }
    }, [isModify]);

    return (
        <div className="w-full px-5 py-10">
            <div className="w-full flex flex-col flex-1 border-2 border-slate-300 rounded-3xl shadow-lg bg-base-300 py-5">
                <AnimatedButton
                    Icon={() => <UilArrowLeft className="!text-neutral" />}
                    text="Retour"
                    ReverseAnimationDirection
                    customButtonClasses={[
                        "btn-outline",
                        "btn-xs",
                        "border-2",
                        "hover:!border-2",
                        "!mr-auto",
                        "ml-10",
                    ]}
                    onClickFct={() => {
                        navigate(-1);
                    }}
                />
                <h1 className="text-2xl font-bold text-center">
                    {isModify
                        ? "Modifier un concours"
                        : "Créer un nouvel concours"}
                </h1>
                <FormProvider {...methods}>
                    <form
                        className="flex-1 mt-2 flex flex-col overflow-y-auto"
                        onSubmit={methods.handleSubmit(submit)}
                    >
                        <div className="w-full flex justify-evenly border-2">
                            <Select
                                options={directions}
                                defaultValue={
                                    isModify ? isModify.direction : undefined
                                }
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
                                            defaultValue={
                                                isModify
                                                    ? isModify.poste
                                                    : undefined
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={grades}
                                            label="Grade"
                                            reg="grade"
                                            defaultValue={
                                                isModify
                                                    ? isModify.grade
                                                    : undefined
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={branches}
                                            label="Branche"
                                            reg="branche"
                                            defaultValue={
                                                isModify
                                                    ? isModify.branche
                                                    : undefined
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={specs}
                                            label="Spécialité"
                                            reg="spécialité"
                                            defaultValue={
                                                isModify
                                                    ? isModify.specialite
                                                    : undefined
                                            }
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
                                        fileShowCase={isModify?.avis.file} /* //explain: passing the 'avis' file when being in modification mode as a FileField Array to be suitable to the fileUploader  */
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
                                        defaultValue={
                                            isModify
                                                ? isModify.limitePlaces
                                                : undefined
                                        }
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
                                        defaultValue={
                                            isModify
                                                ? isModify.limiteAge
                                                : undefined
                                        }
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
                                        defaultValue={
                                            isModify
                                                ? isModify.dateLimiteInscription
                                                : undefined
                                        }
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
                                        defaultValue={
                                            isModify
                                                ? isModify.dateConcours
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-5 p-5 rounded-xl bg-white w-full col-span-3">
                                <DragNDropCities
                                    selectedCities={selectedCities}
                                    setSelectedCities={setSelectedCities}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <label
                                className="btn btn-wide btn-outline btn-success !text-neutral hover:!text-white"
                                onClick={triggerValidation}
                            >
                                {isModify ? "Modifier" : "Valider"}
                            </label>
                        </div>
                        {intitulePanel && (
                            <IntitulePanel
                                showIntitulePanel={showIntitulePanel}
                                direction={selectedDirection}
                                poste={selectedPoste}
                                grade={selectedGrade}
                                CustomLabelInput={CustomLabelInput}
                                showCustomLabelInput={showCustomLabelInput}
                            />
                        )}
                    </form>
                </FormProvider>
            </div>
            {alert.status && <Toast />}
        </div>
    );
};

export default CreateModifyConcours;
