import Input from "../../../Components/ReusableForm/input";
import { useForm, FormProvider } from "react-hook-form";
import Select from "../../../Components/admin/Select";
import FileUpload from "../../../Components/fileUploader/fileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormRegistry from "../../../hooks/admin/concours/useFormRegistry";

const CreateConcours = () => {
    const {schema} = useFormRegistry();
    const methods = useForm({
        resolver: zodResolver(schema)
    });


    return (
        <>
            <h1 className="text-2xl font-bold mb-5">
                Création d'un Nouvel Concours
            </h1>
            <div className="w-full flex flex-col flex-1 border-2 border-slate-300 rounded-3xl shadow-lg bg-base-300 py-5">
                <FormProvider {...methods}>
                    <form className="flex-1 mt-2 flex flex-col overflow-y-auto"
                    >
                        <div className="w-full flex justify-evenly border-2">
                            <Select
                                options={[]}
                                label="Direction"
                                reg="direction"
                            />
                            {/*
                                //TODO: Make a custom multi-options select
                            */}
                            <Select options={[]} label="Villes" reg="Villes" />
                        </div>
                        <div className="grid grid-cols-3 bg-slate-300 mx-10 my-3 p-5 rounded-xl shadow-lg">
                            <div className="col-span-2">
                                <div className="grid grid-cols-2 p-5 pb-8 rounded-xl bg-white">
                                    <h2 className="col-span-2 text-lg font-bold py-1 border-2 border-neutral-content rounded-full text-center">
                                        Type de concours
                                    </h2>
                                    <div className="flex justify-center">
                                        <Select
                                            options={[]}
                                            label="Job"
                                            reg="job"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={[]}
                                            label="Grade"
                                            reg="grade"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={[]}
                                            label="Spécialité"
                                            reg="spécialité"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Select
                                            options={[]}
                                            label="Branche"
                                            reg="branche"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 mt-5 p-5 rounded-xl bg-white">
                                        <h2 className="col-span-2 text-lg font-bold mb-3 py-1 border-2 border-neutral-content rounded-full text-center">
                                        Avis
                                    </h2>
                                    <FileUpload
                                        emptyFiles={false}
                                        shouldEmptyFiles={() => true}
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
                                        type="number"
                                        changeIndicatorPlacement={true}
                                    />
                                    <Input
                                        registerValue="maxAge"
                                        t_left_text="Age maximum"
                                        type="number"
                                        changeIndicatorPlacement={true}
                                    />
                                    <Input
                                        registerValue="dateLimiteDossier"
                                        t_left_text="Date limite du dépôt des dossiers"
                                        type="date"
                                        changeIndicatorPlacement={true}
                                    />
                                    <Input
                                        registerValue="dateConcours"
                                        t_left_text="Date du concours"
                                        type="date"
                                        changeIndicatorPlacement={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <button className="btn btn-wide btn-outline btn-success !text-neutral hover:!text-white"
                                type="submit"
                            >
                                Valider
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    );
};

export default CreateConcours;
