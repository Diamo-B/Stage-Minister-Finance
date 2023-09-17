import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startGenPageLoading, stopGenPageLoading } from "../../../Redux/loading";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../../../Components/fileUploader/fileUploader";
import { IResults } from "../../../Utils/interfaces/Admin/concours/IResults";
import useFormHelpers from "../../../Hooks/admin/concours/results/useFormHelpers";
import Toast from "../../../Components/toast";
import { z } from "zod";
import { resetAccessPlan, resetFinalResults, resetSummonedCandidats, resetWrittenExamResults } from "../../../Redux/Admin/concours/results";

const CreateConcoursResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {alert} = useAppSelector(state => state.alert)
    const [concoursId, setConcoursId] = useState<string | null>(null);
    const [concourLabel, setConcourLabel] = useState<string | null>(null);

    const dispatch = useAppDispatch()
    
    useEffect(() => {
        dispatch(startGenPageLoading())
        resetStates();
        if (location.state?.concoursId) {
            setConcoursId(location.state.concoursId);
            if (location.state?.concoursLabel) {
                setConcourLabel(location.state.concoursLabel);
            }
        } else {
            //redirect to concours management with error
            dispatch(stopGenPageLoading())
            navigate("/admin/concours", {
                state: {
                    message:
                        "Vous devez sélectionner un concours clôturé pour acceder a la page des résultats",
                    type: "alert-error",
                },
            });
        }
        dispatch(stopGenPageLoading())
    }, []);

    const {schema, saveNewResults, fetchConcoursResults, filesShowcaseSchema} = useFormHelpers();
    
    
    const [filesShowcases, setFilesShowcases] = useState<z.infer<typeof filesShowcaseSchema>|null>(null);
    useEffect(()=>{
        if(concoursId !== null){
            fetchConcoursResults(concoursId, setFilesShowcases); 
        }
    },[concoursId])
    
    const methods = useForm<IResults>({
        resolver: zodResolver(schema),
    })

    const [emptyFiles, shouldEmptyFiles] = useState<boolean>(false)

    const { accessPlan,finalResults,summonedCandidats,writtenExamResults } = useAppSelector(state => state.concoursResults)

    const submit = (data: IResults) => {
        concoursId && saveNewResults(data, concoursId);
    }

    const resetStates = () => {
        dispatch(resetAccessPlan());
        dispatch(resetFinalResults());
        dispatch(resetSummonedCandidats());
        dispatch(resetWrittenExamResults());
    }

    useEffect(()=>{
        console.log(filesShowcases);
        
    },[filesShowcases])

    return (
        <>
            {(concourLabel && concoursId) && (
                <div className="w-full flex-grow p-10">
                    <h1 className="text-2xl font-bold text-center mb-2">
                        Définir les résultats du concours
                    </h1>
                    <div className="w-full flex justify-center">
                        <h2 className="text-xl font-bold text-center border-2 border-neutral-content px-10 rounded-full bg-white">
                            {concourLabel}
                        </h2>
                    </div>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(submit)}>
                            <div className="flex-grow w-full grid grid-cols-2 gap-5 p-5 bg-base-100 mt-10 rounded-xl">
                                <div className="text-center">
                                    <h1 className="font-bold text-xl">Candidats Convoqués</h1>
                                    <FileUpload 
                                        emptyFiles={emptyFiles}
                                        shouldEmptyFiles={shouldEmptyFiles}
                                        numberOfFiles={1}
                                        fileShowCase={filesShowcases?.summonedCandidats}
                                        reg="summonedCandidats"
                                    />
                                </div>
                                <div className="text-center">
                                    <h1 className="font-bold text-xl">Plans d'accès aux centres d'examens</h1>
                                    <FileUpload 
                                        emptyFiles={emptyFiles}
                                        shouldEmptyFiles={shouldEmptyFiles}
                                        numberOfFiles={1}
                                        fileShowCase={filesShowcases?.accessPlan}
                                        reg="accessPlan"
                                    />
                                </div>
                                <div className="text-center">
                                    <h1 className="font-bold text-xl">Résultats de l'écrit</h1>
                                    <FileUpload 
                                        emptyFiles={emptyFiles}
                                        shouldEmptyFiles={shouldEmptyFiles}
                                        numberOfFiles={1}
                                        reg="writtenExamResults"
                                        fileShowCase={filesShowcases?.writtenExamResults}
                                    />
                                </div>
                                <div className="text-center">
                                    <h1 className="font-bold text-xl">Résultats définitifs</h1>
                                    <FileUpload 
                                        emptyFiles={emptyFiles}
                                        shouldEmptyFiles={shouldEmptyFiles}
                                        numberOfFiles={1}
                                        reg="finalResults"
                                        fileShowCase={filesShowcases?.finalResults}
                                    />  
                                </div>
                            </div>
                            
                            <div className="w-full my-5 flex gap-20 justify-center">
                                <button className="btn btn-wide btn-outline btn-error hover:!text-white"
                                    onClick={() => {
                                        navigate("/admin/concours");
                                    }}
                                >
                                    Annuler 
                                </button>
                                <button 
                                    onClick={()=>{
                                        methods.setValue("summonedCandidats", summonedCandidats);
                                        methods.setValue("writtenExamResults", writtenExamResults);
                                        methods.setValue("finalResults", finalResults);
                                        methods.setValue("accessPlan", accessPlan);
                                    }}
                                    type="submit" className="btn btn-wide btn-outline btn-success hover:!text-white">
                                    Valider
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                    {
                        alert.status &&
                        <Toast/>
                    }
                </div>
            )}
        </>
    );
};

export default CreateConcoursResults;
