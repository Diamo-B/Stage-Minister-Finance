import { Link } from "react-router-dom";
import { UilFileDownload } from "@iconscout/react-unicons";
import TestResult from "./testRecordResult";
import AnimatedButton from "../../../Components/FormElements/animatedButton";

const ConcoursResultsTable = () => {
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
                        <tr className="hover">
                            <td className="text-left font-bold min-w-max">
                                Concours de recrutement des techniciens de 3ème
                                grade
                            </td>
                            <td>18-10-2023</td>
                            <td>233</td>
                            <td>
                                <Link to="/assets/avis.pdf" download={true}>
                                    <AnimatedButton
                                        Icon={() => (
                                            <UilFileDownload className="mx-auto w-7 h-7 text-white" />
                                        )}
                                        customButtonClasses={[
                                            "!m-0",
                                            "!w-24",
                                            "btn-outline",
                                            "border-slate-400",
                                            "btn-sm",
                                            "text-xs",
                                            "font-medium",
                                            "w-full",
                                            "border-2",
                                            "hover:!border-2",
                                            "hover:border-slate-400",
                                            "hover:bg-slate-400",
                                        ]}
                                        text="Télécharger"
                                    />
                                </Link>
                            </td>
                            <td>-------</td>
                            <td>-------</td>
                            <td>
                                <Link to="/assets/avis.pdf" download={true}>
                                    <AnimatedButton
                                        Icon={() => (
                                            <UilFileDownload className="mx-auto w-7 h-7 text-white" />
                                        )}
                                        customButtonClasses={[
                                            "!m-0",
                                            "!w-24",
                                            "btn-outline",
                                            "border-slate-400",
                                            "btn-sm",
                                            "text-xs",
                                            "font-medium",
                                            "w-full",
                                            "border-2",
                                            "hover:!border-2",
                                            "hover:border-slate-400",
                                            "hover:bg-slate-400",
                                        ]}
                                        text="Télécharger"
                                    />
                                </Link>
                            </td>
                        </tr>
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                        <TestResult />
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ConcoursResultsTable;