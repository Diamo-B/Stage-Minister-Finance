import { UilCheck, UilFileDownload } from "@iconscout/react-unicons";
import AnimatedButton from "../../../Components/FormElements/animatedButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useHelpers, { concours } from "../../../Hooks/Home/useHelpers";
import { useAppSelector } from "../../../Hooks/redux";

const LatestConcoursTable = () => {
    const { getConcours, postuler } = useHelpers();
    const [concours, setConcours] = useState<concours[]>([]);
    const {loading} = useAppSelector(state => state.loading)
    useEffect(() => {
        getConcours(setConcours);
    },[])

    return (
        <section className="max-h-60 overflow-y-auto rounded-lg">
            <div className="relative">
                <table className="table">
                    <thead className="sticky top-0 z-10 bg-white text-center">
                        <tr>
                            <th className="text-left">
                                Concours de recrutement
                            </th>
                            <th>Avis</th>
                            <th>Date du concours</th>
                            <th>Limite depot du dossier</th>
                            <th>Nombre de postes</th>
                            <th>Limite d'age</th>
                            <th>statut</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {concours && concours.length > 0 ? (
                            concours.map(concour => (
                                <tr className="hover" key={concour.id}>
                                    <td className="text-left font-bold">
                                        {concour.label}
                                    </td>
                                    <td>
                                        <Link
                                            to={`${import.meta.env.VITE_BackendBaseUrl.replace(
                                                "/api/v1",
                                                "",
                                            )}${concour.avis.path.replace(
                                                "./public",
                                                "",
                                            )}`}
                                            download={true}
                                        >
                                            <AnimatedButton
                                                Icon={() => (
                                                    <UilFileDownload className="mx-auto w-7 h-7 text-slate-400" />
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
                                    <td>{concour.dateConcours}</td>
                                    <td>{concour.dateLimiteInscription}</td>
                                    <td>{concour.limitePlaces}</td>
                                    <td>{concour.limiteAge}</td>
                                    <td>
                                        {concour.status === "enabled"
                                            ? "Actif"
                                            : "cloturé"}
                                    </td>
                                    <td className="">
                                        <AnimatedButton
                                            Icon={() => (
                                                <UilCheck className="mx-auto w-7 h-7 text-white" />
                                            )}
                                            customButtonClasses={[
                                                "!m-0",
                                                "!w-24",
                                                "btn-outline",
                                                "btn-success",
                                                "btn-sm",
                                                "text-xs",
                                                "font-bold",
                                                "w-full",
                                                "border-2",
                                                "hover:!border-2",
                                            ]}
                                            text="Postuler"
                                            onClickFct={() => postuler()}
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
                                        <p className="my-5 font-medium capitalize text-lg text-neutral">
                                            Aucun concours disponible
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

export default LatestConcoursTable;
