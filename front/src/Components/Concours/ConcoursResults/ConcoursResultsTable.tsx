import { useRef } from "react";
import { useAppSelector } from "../../../Hooks/redux";
import DownloadButton from "../DownloadButton";

const ConcoursResultsTable = () => {
    //TODO: to be implemented later
    const concoursResults  = useAppSelector(state => state.postulerConcours.results);
    const { loading } = useAppSelector(state => state.loading);
    
    const summonedCandidatsListRef = useRef<HTMLAnchorElement>(null)
    const writtenExamResultRef = useRef<HTMLAnchorElement>(null)
    const finalResultsListRef = useRef<HTMLAnchorElement>(null)
    const accesPlansRef = useRef<HTMLAnchorElement>(null)


    return (
        <section className="max-h-60 overflow-auto rounded-lg">
            <div className="relative">
                <table className="table">
                    <thead className="sticky top-0 z-10 bg-white text-center">
                        <tr>
                            <th className="text-left min-w-max">
                                Concours de recrutement
                            </th>
                            <th>Date du concours</th>
                            <th>Nombre de postes</th>
                            <th>Candidats Convoqués</th>
                            <th>Résultats de l'écrit</th>
                            <th>Résultats définitifs</th>
                            <th>Plans d'accès aux centres du concours</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {concoursResults && concoursResults.length > 0 ? (
                            concoursResults.map(result => (
                                <tr className="hover" key={result.id}>
                                    <td className="text-left font-bold min-w-max">
                                        {result.label}
                                    </td>
                                    <td>{result.dateConcours}</td>
                                    <td>{result.limitePlaces}</td>
                                    <td>
                                        <DownloadButton 
                                            fullPath={result.resultFilesPaths.summonedCandidats}
                                            text="Télécharger"
                                            ref={summonedCandidatsListRef}
                                            disabled={result.resultFilesPaths.summonedCandidats?false:true}
                                        />
                                    </td>
                                    <td>
                                        <DownloadButton 
                                            fullPath={result.resultFilesPaths.writtenExamResults}
                                            text="Télécharger"
                                            ref={writtenExamResultRef}
                                            disabled={result.resultFilesPaths.writtenExamResults?false:true}
                                        />
                                    </td>
                                    <td>
                                        <DownloadButton 
                                            fullPath={result.resultFilesPaths.finalResults}
                                            text="Télécharger"
                                            ref={finalResultsListRef}
                                            disabled={result.resultFilesPaths.finalResults?false:true}
                                        />
                                    </td>
                                    <td>
                                        <DownloadButton 
                                            fullPath={result.resultFilesPaths.accessPlan}
                                            text="Télécharger"
                                            ref={accesPlansRef}
                                            disabled={result.resultFilesPaths.accessPlan?false:true}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-md"></span>
                                    ) : (
                                        <p className="my-5 font-medium text-lg text-neutral">
                                            Aucun résultat pour le moment
                                        </p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ConcoursResultsTable;
